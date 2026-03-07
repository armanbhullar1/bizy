'use client'

import { useState, useEffect } from 'react'
import {
  Users,
  Plus,
  FileText,
  CheckCircle2,
  ChevronRight,
  Trash2,
  Upload,
  Download,
  AlertCircle,
  Briefcase,
  Calendar,
  Mail,
  Phone,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  loadEmployees,
  addEmployee,
  deleteEmployee,
  toggleEmployeeDuty,
  addTaxDocument,
  deleteTaxDocument,
} from '@/lib/employee-storage'
import { EMPLOYER_DUTIES, TAX_DOCUMENT_TYPES } from '@/lib/data/employer-duties'
import { useBusinessProfile } from '@/hooks/useBusinessProfile'
import type { Employee, TaxDocument, EmployerDuty } from '@/types'

type Tab = 'employees' | 'duties' | 'documents'

export default function HRPage() {
  const { businessProfile } = useBusinessProfile()
  const [activeTab, setActiveTab] = useState<Tab>('employees')
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDocModal, setShowDocModal] = useState(false)

  // Load employees on mount
  useEffect(() => {
    setEmployees(loadEmployees())
  }, [])

  const refreshEmployees = () => {
    const updated = loadEmployees()
    setEmployees(updated)
    if (selectedEmployee) {
      setSelectedEmployee(updated.find((e) => e.id === selectedEmployee.id) || null)
    }
  }

  const handleAddEmployee = (data: {
    firstName: string
    lastName: string
    email: string
    phone?: string
    role: string
    startDate: string
  }) => {
    addEmployee({
      ...data,
      status: 'onboarding',
    })
    refreshEmployees()
    setShowAddModal(false)
  }

  const handleDeleteEmployee = (id: string) => {
    if (confirm('Are you sure you want to remove this employee?')) {
      deleteEmployee(id)
      if (selectedEmployee?.id === id) {
        setSelectedEmployee(null)
      }
      refreshEmployees()
    }
  }

  const handleToggleDuty = (dutyId: string) => {
    if (!selectedEmployee) return
    toggleEmployeeDuty(selectedEmployee.id, dutyId)
    refreshEmployees()
  }

  const handleAddDocument = (data: { type: TaxDocument['type']; year: number; fileName: string }) => {
    if (!selectedEmployee) return
    addTaxDocument(selectedEmployee.id, {
      ...data,
      status: 'draft',
    })
    refreshEmployees()
    setShowDocModal(false)
  }

  const handleDeleteDocument = (docId: string) => {
    if (!selectedEmployee) return
    deleteTaxDocument(selectedEmployee.id, docId)
    refreshEmployees()
  }

  // Calculate onboarding progress
  const getOnboardingProgress = (employee: Employee) => {
    const completed = employee.onboardingProgress.filter((d) => d.isComplete).length
    const total = employee.onboardingProgress.length
    return { completed, total, percentage: Math.round((completed / total) * 100) }
  }

  return (
    <div className="p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-brand-primary mb-2">
          HR Onboarding
        </h1>
        <p className="text-gray-500">
          Manage employees, employer duties, and tax documents for{' '}
          {businessProfile?.businessName || 'your business'}.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {[
          { id: 'employees' as Tab, label: 'Employees', icon: Users },
          { id: 'duties' as Tab, label: 'Employer Duties', icon: CheckCircle2 },
          { id: 'documents' as Tab, label: 'Tax Documents', icon: FileText },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === id
                ? 'border-brand-accent text-brand-accent'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Employees Tab */}
      {activeTab === 'employees' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Employee List */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-brand-primary">
                Team ({employees.length})
              </h2>
              <Button size="sm" onClick={() => setShowAddModal(true)} className="gap-1">
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>

            <div className="space-y-2">
              {employees.map((employee) => {
                const progress = getOnboardingProgress(employee)
                return (
                  <button
                    key={employee.id}
                    onClick={() => setSelectedEmployee(employee)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedEmployee?.id === employee.id
                        ? 'border-brand-accent bg-brand-accent/5'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-brand-primary">
                          {employee.firstName} {employee.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{employee.role}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Onboarding</span>
                        <span>{progress.percentage}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            progress.percentage === 100 ? 'bg-green-500' : 'bg-brand-accent'
                          }`}
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                    </div>
                  </button>
                )
              })}

              {employees.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                  <p>No employees yet</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3"
                    onClick={() => setShowAddModal(true)}
                  >
                    Add your first employee
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Employee Detail */}
          <div className="lg:col-span-2">
            {selectedEmployee ? (
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-heading font-bold text-brand-primary">
                      {selectedEmployee.firstName} {selectedEmployee.lastName}
                    </h2>
                    <p className="text-gray-500">{selectedEmployee.role}</p>
                  </div>
                  <div className="flex gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        selectedEmployee.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : selectedEmployee.status === 'onboarding'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {selectedEmployee.status}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteEmployee(selectedEmployee.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {selectedEmployee.email}
                  </div>
                  {selectedEmployee.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {selectedEmployee.phone}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    Started: {new Date(selectedEmployee.startDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    {selectedEmployee.role}
                  </div>
                </div>

                {/* Onboarding Progress */}
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="font-heading font-semibold text-brand-primary mb-4">
                    Onboarding Checklist
                  </h3>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {selectedEmployee.onboardingProgress.map((duty) => (
                      <div
                        key={duty.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                          duty.isComplete
                            ? 'bg-green-50 border-green-200'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <button
                          onClick={() => handleToggleDuty(duty.id)}
                          className={`mt-0.5 shrink-0 ${
                            duty.isComplete ? 'text-green-600' : 'text-gray-300'
                          }`}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                        <div className="flex-1">
                          <p
                            className={`font-medium text-sm ${
                              duty.isComplete ? 'text-green-800' : 'text-brand-primary'
                            }`}
                          >
                            {duty.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">{duty.description}</p>
                          <span
                            className={`inline-block mt-1 text-xs px-2 py-0.5 rounded ${
                              duty.category === 'legal'
                                ? 'bg-purple-100 text-purple-700'
                                : duty.category === 'payroll'
                                  ? 'bg-blue-100 text-blue-700'
                                  : duty.category === 'benefits'
                                    ? 'bg-green-100 text-green-700'
                                    : duty.category === 'safety'
                                      ? 'bg-amber-100 text-amber-700'
                                      : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {duty.category}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-12 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">Select an employee to view details</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Duties Tab */}
      {activeTab === 'duties' && (
        <div>
          <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Employer Responsibilities in Canada</p>
              <p className="text-blue-700">
                As a Canadian employer, you're legally required to complete these tasks for each
                employee. Non-compliance can result in CRA penalties.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(
              EMPLOYER_DUTIES.reduce(
                (acc, duty) => {
                  if (!acc[duty.category]) acc[duty.category] = []
                  acc[duty.category].push(duty)
                  return acc
                },
                {} as Record<string, typeof EMPLOYER_DUTIES>
              )
            ).map(([category, duties]) => (
              <div key={category} className="rounded-lg border border-gray-200 bg-white p-5">
                <h3 className="font-heading font-semibold text-brand-primary capitalize mb-4 flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      category === 'legal'
                        ? 'bg-purple-500'
                        : category === 'payroll'
                          ? 'bg-blue-500'
                          : category === 'benefits'
                            ? 'bg-green-500'
                            : category === 'safety'
                              ? 'bg-amber-500'
                              : 'bg-gray-500'
                    }`}
                  />
                  {category}
                </h3>
                <div className="space-y-3">
                  {duties.map((duty) => (
                    <div key={duty.id} className="text-sm">
                      <p className="font-medium text-brand-primary">{duty.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{duty.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div>
          {!selectedEmployee ? (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-12 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 mb-2">Select an employee to manage their tax documents</p>
              <Button variant="outline" onClick={() => setActiveTab('employees')}>
                Go to Employees
              </Button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-heading font-semibold text-brand-primary">
                    Tax Documents for {selectedEmployee.firstName} {selectedEmployee.lastName}
                  </h2>
                  <p className="text-sm text-gray-500">
                    T4s, T4As, ROEs, and other employment tax forms
                  </p>
                </div>
                <Button onClick={() => setShowDocModal(true)} className="gap-1">
                  <Plus className="w-4 h-4" />
                  Add Document
                </Button>
              </div>

              {/* Document Types Reference */}
              <div className="mb-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
                <h3 className="font-medium text-brand-primary mb-3">Document Types</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {TAX_DOCUMENT_TYPES.map((doc) => (
                    <div key={doc.type} className="text-sm">
                      <p className="font-medium text-brand-primary">{doc.type}</p>
                      <p className="text-xs text-gray-500">{doc.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents List */}
              {selectedEmployee.taxDocuments.length > 0 ? (
                <div className="space-y-3">
                  {selectedEmployee.taxDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-white"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-brand-accent/10">
                          <FileText className="w-5 h-5 text-brand-accent" />
                        </div>
                        <div>
                          <p className="font-medium text-brand-primary">
                            {doc.type} - {doc.year}
                          </p>
                          <p className="text-sm text-gray-500">{doc.fileName}</p>
                          <p className="text-xs text-gray-400">
                            Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            doc.status === 'filed'
                              ? 'bg-green-100 text-green-700'
                              : doc.status === 'issued'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {doc.status}
                        </span>
                        <Button variant="ghost" size="icon">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteDocument(doc.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                  <FileText className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                  <p>No tax documents uploaded yet</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => setShowDocModal(true)}
                  >
                    Upload first document
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddModal && (
        <AddEmployeeModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddEmployee}
        />
      )}

      {/* Add Document Modal */}
      {showDocModal && selectedEmployee && (
        <AddDocumentModal
          employeeName={`${selectedEmployee.firstName} ${selectedEmployee.lastName}`}
          onClose={() => setShowDocModal(false)}
          onSubmit={handleAddDocument}
        />
      )}
    </div>
  )
}

// ─── Add Employee Modal ──────────────────────────────────────────────────────

function AddEmployeeModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void
  onSubmit: (data: {
    firstName: string
    lastName: string
    email: string
    phone?: string
    role: string
    startDate: string
  }) => void
}) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    startDate: new Date().toISOString().split('T')[0],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-heading font-bold text-brand-primary mb-6">
          Add New Employee
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name*
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name*
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role/Position*</label>
            <input
              type="text"
              required
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
              placeholder="e.g., Server, Manager, Developer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date*</label>
            <input
              type="date"
              required
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Employee
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Add Document Modal ──────────────────────────────────────────────────────

function AddDocumentModal({
  employeeName,
  onClose,
  onSubmit,
}: {
  employeeName: string
  onClose: () => void
  onSubmit: (data: { type: TaxDocument['type']; year: number; fileName: string }) => void
}) {
  const [formData, setFormData] = useState({
    type: 'T4' as TaxDocument['type'],
    year: new Date().getFullYear() - 1,
    fileName: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-heading font-bold text-brand-primary mb-2">
          Add Tax Document
        </h2>
        <p className="text-sm text-gray-500 mb-6">For {employeeName}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Document Type*</label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as TaxDocument['type'] })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
            >
              {TAX_DOCUMENT_TYPES.map((doc) => (
                <option key={doc.type} value={doc.type}>
                  {doc.type} - {doc.name}
                </option>
              ))}
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tax Year*</label>
            <select
              required
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">File Name*</label>
            <input
              type="text"
              required
              value={formData.fileName}
              onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
              placeholder="e.g., T4_2025_JohnDoe.pdf"
            />
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-500">
              File upload coming soon
            </p>
            <p className="text-xs text-gray-400 mt-1">
              For now, enter the document details to track it
            </p>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Document
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
