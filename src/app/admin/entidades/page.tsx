import AdminPageHeader from '@/app/admin/_components/page-header'

import EntitiesAdminTable from './_components/table'

export default function AdminEntity() {
  return (
    <>
      <AdminPageHeader title="Entidades" />
      <EntitiesAdminTable />
    </>
  )
}
