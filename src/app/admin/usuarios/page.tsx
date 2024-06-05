import AdminPageHeader from '@/app/admin/_components/page-header'

import UsersAdminTable from './_components/table'

export default function AdminUsers() {
  return (
    <>
      <AdminPageHeader title="Usuários" />
      <UsersAdminTable />
    </>
  )
}
