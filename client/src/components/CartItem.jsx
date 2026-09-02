import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CartItem({ item, onQty, onRemove }) {
  return (
    <div className="flex gap-4 border-b border-slate-100 py-5">
      <Link to={`/products/${item.product_id}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
        <img src={item.image_url} alt={item.product_name} className="h-full w-full object-cover" />
      </Link>
      <div className="flex flex-1 flex-col justify-between sm:flex-row">
        <div>
          <Link to={`/products/${item.product_id}`} className="font-semibold">
            {item.product_name}
          </Link>
          <p className="mt-1 text-sm text-mute">
            {item.size ? `Size: ${item.size}` : ''} {item.color ? `· Color: ${item.color}` : ''}
          </p>
          <p className="mt-2 font-bold">₹{Number(item.price).toFixed(2)}</p>
        </div>
        <div className="mt-3 flex items-center gap-4 sm:mt-0">
          <div className="flex items-center rounded-xl border border-slate-200">
            <button className="p-2" onClick={() => onQty(item.cart_item_id, Math.max(1, item.quantity - 1))}>
              <Minus size={14} />
            </button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <button className="p-2" onClick={() => onQty(item.cart_item_id, item.quantity + 1)}>
              <Plus size={14} />
            </button>
          </div>
          <button className="text-mute hover:text-rose-500" onClick={() => onRemove(item.cart_item_id)}>
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
