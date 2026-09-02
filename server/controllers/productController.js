const { pool } = require('../config/db');
const { success, fail } = require('../utils/response');

async function attachVariantsAndImages(products) {
  if (!products.length) return products;
  const ids = products.map((p) => p.product_id);
  const placeholders = ids.map(() => '?').join(',');

  const [images] = await pool.query(
    `SELECT * FROM product_images WHERE product_id IN (${placeholders})`,
    ids
  );
  const [variants] = await pool.query(
    `SELECT * FROM product_variants WHERE product_id IN (${placeholders})`,
    ids
  );

  return products.map((p) => ({
    ...p,
    price: Number(p.price),
    old_price: p.old_price !== null ? Number(p.old_price) : null,
    rating: Number(p.rating),
    images: images.filter((i) => i.product_id === p.product_id).map((i) => i.image_url),
    variants: variants.filter((v) => v.product_id === p.product_id),
  }));
}

exports.listProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      rating,
      sort = 'newest',
      page = 1,
      limit = 12,
      brand,
      size,
      color,
    } = req.query;

    const where = [];
    const params = [];

    if (search) {
      where.push('(p.product_name LIKE ? OR p.description LIKE ? OR p.brand LIKE ?)');
      const q = `%${search}%`;
      params.push(q, q, q);
    }
    if (category) {
      where.push('p.category_id = ?');
      params.push(Number(category));
    }
    if (minPrice) {
      where.push('p.price >= ?');
      params.push(Number(minPrice));
    }
    if (maxPrice) {
      where.push('p.price <= ?');
      params.push(Number(maxPrice));
    }
    if (rating) {
      where.push('p.rating >= ?');
      params.push(Number(rating));
    }
    if (brand) {
      where.push('p.brand = ?');
      params.push(brand);
    }
    if (size || color) {
      where.push(`EXISTS (
        SELECT 1 FROM product_variants v
        WHERE v.product_id = p.product_id
        ${size ? 'AND v.size = ?' : ''}
        ${color ? 'AND v.color = ?' : ''}
      )`);
      if (size) params.push(size);
      if (color) params.push(color);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    let orderBy = 'p.created_at DESC';
    if (sort === 'price_asc') orderBy = 'p.price ASC';
    else if (sort === 'price_desc') orderBy = 'p.price DESC';
    else if (sort === 'popularity') orderBy = 'p.total_reviews DESC, p.rating DESC';
    else if (sort === 'newest') orderBy = 'p.created_at DESC';

    const pageNum = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(48, Math.max(1, Number(limit) || 12));
    const offset = (pageNum - 1) * pageSize;

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM products p ${whereSql}`,
      params
    );
    const total = countRows[0].total;

    const [rows] = await pool.query(
      `SELECT p.*, c.category_name
       FROM products p
       JOIN categories c ON c.category_id = p.category_id
       ${whereSql}
       ORDER BY ${orderBy}
       LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    );

    const data = await attachVariantsAndImages(rows);
    return success(res, 'Products loaded', {
      items: data,
      pagination: { page: pageNum, limit: pageSize, total, pages: Math.ceil(total / pageSize) },
    });
  } catch (err) {
    console.error(err);
    return fail(res, 'Unable to load products', 500);
  }
};

exports.searchProducts = async (req, res) => {
  req.query.search = req.query.query || req.query.search;
  return exports.listProducts(req, res);
};

exports.getByCategory = async (req, res) => {
  req.query.category = req.params.categoryId;
  return exports.listProducts(req, res);
};

exports.getProduct = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, c.category_name
       FROM products p
       JOIN categories c ON c.category_id = p.category_id
       WHERE p.product_id = ?`,
      [req.params.id]
    );
    if (!rows.length) return fail(res, 'Product not found', 404);

    const [withMeta] = await attachVariantsAndImages(rows);
    const [related] = await pool.query(
      `SELECT p.*, c.category_name
       FROM products p
       JOIN categories c ON c.category_id = p.category_id
       WHERE p.category_id = ? AND p.product_id <> ?
       ORDER BY p.rating DESC
       LIMIT 4`,
      [rows[0].category_id, rows[0].product_id]
    );
    withMeta.related = await attachVariantsAndImages(related);
    return success(res, 'Product loaded', withMeta);
  } catch (err) {
    console.error(err);
    return fail(res, 'Unable to load product', 500);
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { category_id, product_name, description, price, old_price, stock, image_url, brand } = req.body;
    if (!category_id || !product_name || price == null) {
      return fail(res, 'category_id, product_name and price are required');
    }
    const [result] = await pool.query(
      `INSERT INTO products (category_id, product_name, description, price, old_price, stock, image_url, brand)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [category_id, product_name, description || '', price, old_price || null, stock || 0, image_url || null, brand || null]
    );
    return success(res, 'Product created', { product_id: result.insertId }, 201);
  } catch (err) {
    console.error(err);
    return fail(res, 'Unable to create product', 500);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { category_id, product_name, description, price, old_price, stock, image_url, brand } = req.body;
    const [result] = await pool.query(
      `UPDATE products SET category_id = ?, product_name = ?, description = ?, price = ?, old_price = ?, stock = ?, image_url = ?, brand = ?
       WHERE product_id = ?`,
      [category_id, product_name, description, price, old_price, stock, image_url, brand, req.params.id]
    );
    if (!result.affectedRows) return fail(res, 'Product not found', 404);
    return success(res, 'Product updated');
  } catch (err) {
    console.error(err);
    return fail(res, 'Unable to update product', 500);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM products WHERE product_id = ?', [req.params.id]);
    if (!result.affectedRows) return fail(res, 'Product not found', 404);
    return success(res, 'Product deleted');
  } catch (err) {
    console.error(err);
    return fail(res, 'Unable to delete product', 500);
  }
};

exports.filters = async (_req, res) => {
  try {
    const [brands] = await pool.query(
      'SELECT DISTINCT brand FROM products WHERE brand IS NOT NULL ORDER BY brand'
    );
    const [sizes] = await pool.query(
      'SELECT DISTINCT size FROM product_variants WHERE size IS NOT NULL ORDER BY size'
    );
    const [colors] = await pool.query(
      'SELECT DISTINCT color FROM product_variants WHERE color IS NOT NULL ORDER BY color'
    );
    return success(res, 'Filters loaded', {
      brands: brands.map((b) => b.brand),
      sizes: sizes.map((s) => s.size),
      colors: colors.map((c) => c.color),
    });
  } catch (err) {
    console.error(err);
    return fail(res, 'Unable to load filters', 500);
  }
};
