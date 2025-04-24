import Form from '@/app/ui/invoices/edit-form'
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs'
import { fetchCustomers, fetchInvoiceById } from '@/app/lib/data'
import { UpdateInvoice } from '@/app/ui/invoices/buttons'
import { updateInvoice } from '@/app/lib/actions'

export default async function Page(props: {
  params: Promise<{
    id: string
  }>
}) {
  const { id } = await props.params
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ])
  const updateInvoiceWithId = updateInvoice.bind(null, id)

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form
        action={updateInvoiceWithId}
        invoice={invoice}
        customers={customers}
      />
    </main>
  )
}
