import AdminPageHeader from '@/app/admin/_components/page-header'

import ProjectsAdminTable from './_components/table'

export default function AdminIndicator() {
  return (
    <>
      <AdminPageHeader title="Obras" />
      <ProjectsAdminTable />
    </>
  )
}
