import React, { useId, useRef, useState } from 'react';
import { ChevronDown, ImagePlus, Lock, Plus, Trash2, AlertTriangle, Upload } from 'lucide-react';
import { resolveImage } from '../data/catalog';
import { Button } from '../components/ui/Button';
import { ChoiceChips, TextField, TextAreaField, inputClass } from '../components/ui/Field';
import { EditPack, EditProduct, PACK_CHOICES, packWeight, slugFromName, tidyPackSize } from './model';
import { preparePhoto } from './image';
import { AdminError } from './github';
import { toast } from '../components/ui/Toast';

const OTHER = '__other';

/** An on/off switch with a visible label, used for stock. */
export const Switch: React.FC<{ checked: boolean; onChange: (v: boolean) => void; label: string; onText?: string; offText?: string }> = ({
  checked,
  onChange,
  label,
  onText = 'In stock',
  offText = 'Out of stock',
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className="inline-flex min-h-11 items-center gap-2.5 rounded-full pr-1 text-sm font-semibold cursor-pointer"
  >
    <span className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${checked ? 'bg-forest-700' : 'bg-line-strong'}`}>
      <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-[left] duration-200 ${checked ? 'left-6' : 'left-1'}`} />
    </span>
    <span className={checked ? 'text-forest-800' : 'text-danger'}>{checked ? onText : offText}</span>
  </button>
);

/** A rupee amount box. Kept as text so an empty box stays empty while typing. */
const MoneyInput: React.FC<{ value: string; onChange: (v: string) => void; label: string; changed?: boolean; placeholder?: string }> = ({
  value,
  onChange,
  label,
  changed,
  placeholder,
}) => (
  <div className="relative">
    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">₹</span>
    <input
      type="text"
      inputMode="decimal"
      aria-label={label}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ''))}
      className={`${inputClass} pl-8 tabular ${changed ? 'ring-2 ring-gold-500 bg-gold-50' : ''}`}
    />
  </div>
);

/** Choose a photo by tapping or by dragging it onto the box. Shrinks it before upload. */
export const PhotoPicker: React.FC<{
  slug: string;
  current?: string;
  onPicked: (img: { sitePath: string; base64: string; previewUrl: string }) => void;
  fit: 'cover' | 'contain';
}> = ({ slug, current, onPicked, fit }) => {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const id = useId();

  const take = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    try {
      onPicked(await preparePhoto(file, slug || 'product'));
    } catch (e) {
      toast({ message: e instanceof AdminError ? e.message : 'That photo could not be used.', tone: 'error' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-forest-800">
        Photo
      </label>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          take(e.dataTransfer.files[0]);
        }}
        className={`flex items-center gap-4 rounded-2xl border-2 border-dashed p-3 transition-colors ${
          drag ? 'border-gold-500 bg-gold-50' : 'border-line-strong bg-white'
        }`}
      >
        <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-xl bg-cream">
          {current ? (
            <img src={current} alt="" className={`h-full w-full ${fit === 'contain' ? 'object-contain p-1' : 'object-cover'}`} referrerPolicy="no-referrer" />
          ) : (
            <ImagePlus className="h-8 w-8 text-muted" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0">
          <Button variant="outline" size="sm" icon={<Upload className="h-4 w-4" />} loading={busy} onClick={() => input.current?.click()}>
            {current ? 'Change photo' : 'Choose photo'}
          </Button>
          <p className="mt-1.5 text-sm text-muted">JPG, PNG or WebP. Drag it here, or tap the button. It is resized for you.</p>
        </div>
        <input
          id={id}
          ref={input}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(e) => {
            take(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
      </div>
    </div>
  );
};

/** Picks a pack size from the common list, or "Other" with a typed size. */
const PackSizePicker: React.FC<{ taken: string[]; value: string; custom: string; onValue: (v: string) => void; onCustom: (v: string) => void }> = ({
  taken,
  value,
  custom,
  onValue,
  onCustom,
}) => {
  const free = PACK_CHOICES.filter((c) => !taken.some((t) => t.toLowerCase() === c.toLowerCase()));
  return (
    <div className="space-y-2">
      <ChoiceChips
        label="Pack size"
        value={value}
        onChange={onValue}
        options={[...free.map((c) => ({ value: c, label: c })), { value: OTHER, label: 'Other size…' }]}
      />
      {value === OTHER && (
        <input
          aria-label="Other pack size"
          value={custom}
          onChange={(e) => onCustom(e.target.value)}
          placeholder="e.g. 25kg Bag or 1kg Pouch"
          className={inputClass}
        />
      )}
    </div>
  );
};

export const ProductEditor: React.FC<{
  product: EditProduct;
  original?: EditProduct;
  problems?: string[];
  onChange: (p: EditProduct) => void;
  onRemove?: () => void;
}> = ({ product, original, problems, onChange, onRemove }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [newSize, setNewSize] = useState('');
  const [customSize, setCustomSize] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newMrp, setNewMrp] = useState('');

  const p = product;
  const setPack = (i: number, patch: Partial<EditPack>) => onChange({ ...p, packs: p.packs.map((pk, j) => (j === i ? { ...pk, ...patch } : pk)) });
  const origPack = (size: string) => original?.packs.find((o) => o.size === size);
  const image = p.newImage?.previewUrl ?? (p.image ? resolveImage(p.image) : undefined);

  const addPack = () => {
    const size = tidyPackSize(newSize === OTHER ? customSize : newSize);
    if (!size) return toast({ message: 'Choose or type a pack size first.', tone: 'error' });
    if (p.packs.some((pk) => pk.size.toLowerCase() === size.toLowerCase())) return toast({ message: `${size} is already listed.`, tone: 'error' });
    if (!(Number(newPrice) >= 10)) return toast({ message: 'Enter the price for this pack (₹10 or more).', tone: 'error' });
    const packs = [...p.packs, { size, weightKg: packWeight(size), price: newPrice, mrp: newMrp, inStock: true, builtIn: false }];
    onChange({ ...p, packs: packs.sort((a, b) => a.weightKg - b.weightKg) });
    setNewSize('');
    setCustomSize('');
    setNewPrice('');
    setNewMrp('');
    toast({ message: `${size} added to ${p.shortName || p.name}. Press Publish to put it on the website.` });
  };

  return (
    <article className={`rounded-3xl bg-white ring-1 shadow-soft ${problems?.length ? 'ring-danger/50' : 'ring-line'}`} id={`product-${p.slug}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center gap-4 border-b border-line p-5">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-cream ring-1 ring-line">
          {image && <img src={image} alt="" className={`h-full w-full ${p.imageFit === 'contain' ? 'object-contain p-1' : 'object-cover'}`} referrerPolicy="no-referrer" />}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-display text-2xl text-forest-800">{p.name || 'New product'}</h2>
          <p className="text-sm text-muted">
            {p.builtIn ? 'Built-in product' : 'Added product'} · web address <code className="rounded bg-cream px-1">#product-detail/{p.slug}</code>
          </p>
        </div>
        <Switch checked={p.inStock} onChange={(v) => onChange({ ...p, inStock: v })} label={`${p.name} stock`} onText="Selling" offText="Whole product out of stock" />
      </div>

      {problems && problems.length > 0 && (
        <ul className="space-y-1 border-b border-danger/20 bg-danger-50 px-5 py-3 text-sm font-medium text-danger" role="alert">
          {problems.map((m) => (
            <li key={m} className="flex gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> {m}
            </li>
          ))}
        </ul>
      )}

      {/* Packs */}
      <div className="p-5">
        <div className="hidden grid-cols-[1.4fr_1fr_1fr_auto_2.75rem] gap-3 px-1 pb-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-muted md:grid">
          <span>Pack</span>
          <span>Price</span>
          <span>MRP (crossed out)</span>
          <span>Stock</span>
          <span className="sr-only">Remove</span>
        </div>
        <ul className="space-y-3">
          {p.packs.map((pack, i) => {
            const o = origPack(pack.size);
            const priceChanged = !!o && o.price !== pack.price;
            const bigJump = priceChanged && Number(o!.price) > 0 && Math.abs(Number(pack.price) - Number(o!.price)) / Number(o!.price) > 0.25;
            return (
              <li key={pack.size} className="grid grid-cols-2 items-center gap-3 rounded-2xl bg-cream/60 p-3 md:grid-cols-[1.4fr_1fr_1fr_auto_2.75rem] md:bg-transparent md:p-1">
                <div className="col-span-2 flex items-center gap-2 font-semibold text-forest-800 md:col-span-1">
                  {pack.size}
                  {pack.builtIn && <Lock className="h-3.5 w-3.5 text-muted" aria-label="Built-in pack, cannot be removed" />}
                  {!o && <span className="rounded-full bg-gold-100 px-2 py-0.5 text-xs font-semibold text-gold-700">New</span>}
                </div>
                <div>
                  <span className="mb-1 block text-xs font-semibold text-muted md:hidden">Price</span>
                  <MoneyInput label={`${pack.size} price`} value={pack.price} changed={priceChanged} onChange={(v) => setPack(i, { price: v })} />
                  {bigJump && <p className="mt-1 text-xs font-medium text-gold-700">Big change from ₹{o!.price}. Double-check it.</p>}
                </div>
                <div>
                  <span className="mb-1 block text-xs font-semibold text-muted md:hidden">MRP</span>
                  <MoneyInput
                    label={`${pack.size} MRP`}
                    value={pack.mrp}
                    placeholder="Same as price"
                    changed={!!o && o.mrp !== pack.mrp}
                    onChange={(v) => setPack(i, { mrp: v })}
                  />
                </div>
                <Switch checked={pack.inStock} onChange={(v) => setPack(i, { inStock: v })} label={`${pack.size} stock`} />
                {pack.builtIn ? (
                  <span className="hidden md:block" />
                ) : (
                  <button
                    type="button"
                    onClick={() => onChange({ ...p, packs: p.packs.filter((_, j) => j !== i) })}
                    aria-label={`Remove ${pack.size}`}
                    className="grid h-11 w-11 place-items-center justify-self-end rounded-full text-muted hover:bg-danger-50 hover:text-danger cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        {/* Add a pack size */}
        <div className="mt-5 rounded-2xl bg-forest-50 p-4 ring-1 ring-forest-200">
          <p className="mb-3 font-semibold text-forest-800">Add a pack size</p>
          <PackSizePicker taken={p.packs.map((pk) => pk.size)} value={newSize} custom={customSize} onValue={setNewSize} onCustom={setCustomSize} />
          <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <MoneyInput label="New pack price" value={newPrice} onChange={setNewPrice} placeholder="Price" />
            <MoneyInput label="New pack MRP" value={newMrp} onChange={setNewMrp} placeholder="MRP (optional)" />
            <Button icon={<Plus className="h-4 w-4" />} onClick={addPack}>
              Add pack
            </Button>
          </div>
        </div>
      </div>

      {/* Name, description, photo */}
      <div className="border-t border-line">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          aria-expanded={showDetails}
          className="flex min-h-14 w-full items-center justify-between px-5 text-left font-semibold text-forest-800 cursor-pointer"
        >
          Name, description and photo
          <ChevronDown className={`h-5 w-5 text-muted transition-transform ${showDetails ? 'rotate-180' : ''}`} />
        </button>
        {showDetails && (
          <div className="grid gap-4 px-5 pb-5 md:grid-cols-2">
            <TextField label="Full name" required value={p.name} onChange={(e) => onChange({ ...p, name: e.target.value })} />
            <TextField
              label="Short name"
              hint="Used on buttons and filters, e.g. HMT Rice"
              value={p.shortName}
              onChange={(e) => onChange({ ...p, shortName: e.target.value })}
            />
            <TextField label="One line under the name" value={p.subTitle} onChange={(e) => onChange({ ...p, subTitle: e.target.value })} wrapperClassName="md:col-span-2" />
            <TextAreaField label="Description" rows={4} value={p.description} onChange={(e) => onChange({ ...p, description: e.target.value })} wrapperClassName="md:col-span-2" />
            <PhotoPicker slug={p.slug} current={image} fit={p.imageFit} onPicked={(img) => onChange({ ...p, newImage: img })} />
            <div>
              <p className="mb-1.5 text-sm font-semibold text-forest-800">How the photo fits</p>
              <ChoiceChips
                label="Photo fit"
                value={p.imageFit}
                onChange={(v) => onChange({ ...p, imageFit: v })}
                options={[
                  { value: 'contain', label: 'Show whole photo', hint: 'Best for bag photos' },
                  { value: 'cover', label: 'Fill the frame', hint: 'Best for food photos' },
                ]}
              />
            </div>
          </div>
        )}
      </div>

      {onRemove && (
        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-line px-5 py-4">
          {confirmRemove ? (
            <>
              <span className="text-sm font-medium text-danger">Remove {p.name} from the website?</span>
              <Button variant="ghost" size="sm" onClick={() => setConfirmRemove(false)}>
                Keep it
              </Button>
              <Button variant="danger" size="sm" icon={<Trash2 className="h-4 w-4" />} onClick={onRemove}>
                Yes, remove
              </Button>
            </>
          ) : (
            <Button variant="danger" size="sm" icon={<Trash2 className="h-4 w-4" />} onClick={() => setConfirmRemove(true)}>
              Remove product
            </Button>
          )}
        </div>
      )}
    </article>
  );
};

/** The "Add a product" form. Creates the product in the list; Publish puts it on the website. */
export const AddProductForm: React.FC<{ existingSlugs: string[]; onAdd: (p: EditProduct) => void }> = ({ existingSlugs, onAdd }) => {
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fit, setFit] = useState<'cover' | 'contain'>('contain');
  const [photo, setPhoto] = useState<{ sitePath: string; base64: string; previewUrl: string }>();
  const [size, setSize] = useState('26kg Bag');
  const [custom, setCustom] = useState('');
  const [price, setPrice] = useState('');
  const [mrp, setMrp] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const slug = slugFromName(name);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const packSize = tidyPackSize(size === OTHER ? custom : size);
    const errs: string[] = [];
    if (!name.trim()) errs.push('Give the product a name.');
    else if (!slug) errs.push('The name needs some letters or numbers.');
    else if (existingSlugs.includes(slug)) errs.push(`A product called "${slug}" already exists. Use a different name.`);
    if (!photo) errs.push('Choose a photo.');
    if (!packSize) errs.push('Choose a pack size.');
    if (!(Number(price) >= 10)) errs.push('Enter the price for the pack (₹10 or more).');
    if (mrp && Number(mrp) < Number(price)) errs.push('The MRP cannot be lower than the price.');
    setErrors(errs);
    if (errs.length) return;
    onAdd({
      slug,
      builtIn: false,
      name: name.trim(),
      shortName: shortName.trim() || name.trim(),
      subTitle: subTitle.trim(),
      description: description.trim(),
      image: '',
      imageFit: fit,
      newImage: photo,
      inStock: true,
      packs: [{ size: packSize, weightKg: packWeight(packSize), price, mrp, inStock: true, builtIn: false }],
    });
  };

  return (
    <form onSubmit={submit} noValidate className="rounded-3xl bg-white p-5 ring-1 ring-line shadow-soft sm:p-8">
      <h2 className="font-display text-3xl text-forest-800">Add a new product</h2>
      <p className="mt-1 text-muted">It appears in your list below. Press Publish when you are ready to put it on the website.</p>

      {errors.length > 0 && (
        <ul className="mt-5 space-y-1 rounded-2xl bg-danger-50 px-4 py-3 text-sm font-medium text-danger" role="alert">
          {errors.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      )}

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <TextField
          label="Full name"
          required
          placeholder="LG Gold Sona Masoori Rice"
          value={name}
          onChange={(e) => setName(e.target.value)}
          hint={slug ? `Web address: #product-detail/${slug}` : undefined}
        />
        <TextField label="Short name" placeholder="Sona Masoori" hint="Used on buttons and filters" value={shortName} onChange={(e) => setShortName(e.target.value)} />
        <TextField label="One line under the name" placeholder="Light, aromatic everyday rice" value={subTitle} onChange={(e) => setSubTitle(e.target.value)} wrapperClassName="md:col-span-2" />
        <TextAreaField label="Description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} wrapperClassName="md:col-span-2" />
        <PhotoPicker slug={slug} current={photo?.previewUrl} fit={fit} onPicked={setPhoto} />
        <div>
          <p className="mb-1.5 text-sm font-semibold text-forest-800">How the photo fits</p>
          <ChoiceChips
            label="Photo fit"
            value={fit}
            onChange={setFit}
            options={[
              { value: 'contain', label: 'Show whole photo', hint: 'Best for bag photos' },
              { value: 'cover', label: 'Fill the frame', hint: 'Best for food photos' },
            ]}
          />
        </div>
        <div className="md:col-span-2">
          <p className="mb-1.5 text-sm font-semibold text-forest-800">First pack size</p>
          <PackSizePicker taken={[]} value={size} custom={custom} onValue={setSize} onCustom={setCustom} />
          <p className="mt-1.5 text-sm text-muted">You can add more sizes after this.</p>
        </div>
        <div>
          <p className="mb-1.5 text-sm font-semibold text-forest-800">Price *</p>
          <MoneyInput label="Price" value={price} onChange={setPrice} placeholder="e.g. 1750" />
        </div>
        <div>
          <p className="mb-1.5 text-sm font-semibold text-forest-800">MRP (crossed-out price)</p>
          <MoneyInput label="MRP" value={mrp} onChange={setMrp} placeholder="Optional" />
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <Button type="submit" size="lg" icon={<Plus className="h-5 w-5" />}>
          Add to my products
        </Button>
      </div>
    </form>
  );
};
