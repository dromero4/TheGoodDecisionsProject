export default function ShippingAddressForm({
  shippingAddress,
  updateShippingField,
  loadingUser,
  accountUser,
}) {
  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-4">
        <p className="text-sm font-bold text-slate-950">Dirección de entrega</p>

        {loadingUser ? (
          <p className="mt-1 text-xs text-slate-500">Cargando dirección...</p>
        ) : accountUser?.address ? (
          <p className="mt-1 text-xs text-slate-500">
            Usaremos la dirección guardada en tu perfil. Puedes editarla aquí antes
            de pagar.
          </p>
        ) : (
          <p className="mt-1 text-xs text-slate-500">
            Añade una dirección para poder continuar con el pago.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3">
        <Input
          value={shippingAddress.fullName}
          onChange={(value) => updateShippingField("fullName", value)}
          placeholder="Nombre completo"
        />

        <Input
          type="tel"
          value={shippingAddress.phone}
          onChange={(value) => updateShippingField("phone", value)}
          placeholder="Teléfono"
        />

        <div className="grid grid-cols-[1fr_70px] gap-3">
          <Input
            value={shippingAddress.street}
            onChange={(value) => updateShippingField("street", value)}
            placeholder="Calle"
          />

          <Input
            value={shippingAddress.number}
            onChange={(value) => updateShippingField("number", value)}
            placeholder="Nº"
          />
        </div>

        <Input
          value={shippingAddress.floorDoor}
          onChange={(value) => updateShippingField("floorDoor", value)}
          placeholder="Piso / puerta / local"
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            value={shippingAddress.postalCode}
            onChange={(value) => updateShippingField("postalCode", value)}
            placeholder="Código postal"
          />

          <Input
            value={shippingAddress.city}
            onChange={(value) => updateShippingField("city", value)}
            placeholder="Ciudad"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            value={shippingAddress.province}
            onChange={(value) => updateShippingField("province", value)}
            placeholder="Provincia"
          />

          <Input
            value={shippingAddress.country}
            onChange={(value) => updateShippingField("country", value)}
            placeholder="País"
          />
        </div>

        <textarea
          value={shippingAddress.additionalInfo}
          onChange={(e) =>
            updateShippingField("additionalInfo", e.target.value)
          }
          placeholder="Información adicional para la entrega"
          rows={3}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
        />
      </div>
    </div>
  );
}

function Input({ type = "text", value, onChange, placeholder }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
    />
  );
}