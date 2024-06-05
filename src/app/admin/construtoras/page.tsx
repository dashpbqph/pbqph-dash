import AdminPageHeader from '@/app/admin/_components/page-header'

import CompaniesAdminTable from './_components/table'

export default function AdminIndicator() {
  return (
    <>
      <AdminPageHeader title="Construtoras" />
      <CompaniesAdminTable />
    </>
  )
}
