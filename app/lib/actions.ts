'use server'

import { z } from 'zod'

import postgres from 'postgres'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

const InvoiceSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
})

const CreateInvoiceSchema = InvoiceSchema.omit({
  id: true,
  date: true,
})
export async function createInvoice(form: FormData) {
  const { customerId, amount, status } = CreateInvoiceSchema.parse({
    customerId: form.get('customerId'),
    amount: form.get('amount'),
    status: form.get('status'),
  })

  const amountInCents = amount * 100
  const date = new Date().toISOString().split('T')[0]

  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `
  revalidatePath('/dashboard/invoices')
  redirect('/dashboard/invoices')
}

const UpdateInvoiceSchema = InvoiceSchema.omit({ id: true, date: true })
export async function updateInvoice(id: string, form: FormData) {
  const { customerId, amount, status } = UpdateInvoiceSchema.parse(
    Object.fromEntries(form.entries())
  )
  const amountInCents = amount * 100

  await sql`
    UPDATE invoices 
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status} 
    WHERE id = ${id}
  `

  revalidatePath(`/dashboard/invoices`)
  redirect('/dashboard/invoices')
}

export async function deleteInvoice(id: string) {
  console.log('deleting invoice with id:', id)

  await sql`
    DELETE FROM invoices WHERE id = ${id}
  `
  revalidatePath(`/dashboard/invoices`)
}
