export default function StatusPedido({ status }) {

  const styles = {

    aberta: {
      color: "text-yellow-600 bg-yellow-100 rounded-xl",
      label: "Pendente"
    },

    nao_pago: {
      color: "text-red-600 bg-red-100 rounded-xl",
      label: "Não Pago"
    },

    pago: {
      color: "text-green-600 bg-green-100 rounded-xl",
      label: "Pago"
    }

  }

  const s = styles[status] || styles.aberta

  return (
    <span className={`text-xs font-semibold justify-center items-center text-center py-1 px-2 h-6 ${s.color}`}>
      {s.label}
    </span>
  )
}