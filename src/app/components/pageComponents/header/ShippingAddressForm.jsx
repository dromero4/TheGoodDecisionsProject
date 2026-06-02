export default function ShippingAddressForm({
  shippingAddress,
  updateShippingField,
  loadingUser,
  accountUser,
  errors = {},
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
        id="fullName"
          value={shippingAddress.fullName}
          onChange={(value) => updateShippingField("fullName", value)}
          placeholder="Nombre completo"
        />
        {errors?.fullName && (
          <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
        )}
        

        <Input
          id="phone"
          type="tel"
          value={shippingAddress.phone}
          onChange={(value) => updateShippingField("phone", value)}
          placeholder="Teléfono"
        />
        {errors?.phone && (
          <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
        )}
        

        <div className="grid grid-cols-[1fr_70px] gap-3">
          <Input
            id="street"
            value={shippingAddress.street}
            onChange={(value) => updateShippingField("street", value)}
            placeholder="Calle"
          />
          {errors?.street && (
            <p className="mt-1 text-xs text-red-600">{errors.street}</p>
            
          )}

          <Input
            id="number"
            value={shippingAddress.number}
            onChange={(value) => updateShippingField("number", value)}
            placeholder="Nº"
          />
        </div>
          {errors?.number && (
            <p className="mt-1 text-xs text-red-600">{errors.number}</p>
          )}

        <Input
          id="floorDoor"
          value={shippingAddress.floorDoor}
          onChange={(value) => updateShippingField("floorDoor", value)}
          placeholder="Piso / puerta / local"
        />
        {errors?.floorDoor && (
          <p className="mt-1 text-xs text-red-600">{errors.floorDoor}</p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Input
            id="postalCode"
            value={shippingAddress.postalCode}
            onChange={(value) => updateShippingField("postalCode", value)}
            placeholder="Código postal"
          />
          {errors?.postalCode && (
            <p className="mt-1 text-xs text-red-600">{errors.postalCode}</p>
          )}

          <Input
            id="city"
            value={shippingAddress.city}
            onChange={(value) => updateShippingField("city", value)}
            placeholder="Ciudad"
          />
          {errors?.city && (
            <p className="mt-1 text-xs text-red-600">{errors.city}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            id="province"
            value={shippingAddress.province}
            onChange={(value) => updateShippingField("province", value)}
            placeholder="Provincia"
          />

          <Input
            id="country"
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