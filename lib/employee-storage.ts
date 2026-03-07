/**
 * Storage utilities for employee data.
 * Uses localStorage for now, can be swapped to Firebase later.
 */

import type { Employee, EmployerDuty, TaxDocument } from '@/types'
import { EMPLOYER_DUTIES } from '@/lib/data/employer-duties'

const STORAGE_KEY = 'bizy_employees'

// ─── Employee CRUD ───────────────────────────────────────────────────────────

export function loadEmployees(): Employee[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) return []
  try {
    return JSON.parse(data) as Employee[]
  } catch {
    return []
  }
}

export function saveEmployees(employees: Employee[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(employees))
}

export function addEmployee(employee: Omit<Employee, 'id' | 'createdAt' | 'onboardingProgress' | 'taxDocuments'>): Employee {
  const employees = loadEmployees()
  
  // Create new employee with default onboarding duties
  const newEmployee: Employee = {
    ...employee,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    onboardingProgress: EMPLOYER_DUTIES.map((duty) => ({
      ...duty,
      isComplete: false,
    })),
    taxDocuments: [],
  }
  
  employees.push(newEmployee)
  saveEmployees(employees)
  return newEmployee
}

export function updateEmployee(id: string, updates: Partial<Employee>): Employee | null {
  const employees = loadEmployees()
  const index = employees.findIndex((e) => e.id === id)
  if (index === -1) return null
  
  employees[index] = { ...employees[index], ...updates }
  saveEmployees(employees)
  return employees[index]
}

export function deleteEmployee(id: string): boolean {
  const employees = loadEmployees()
  const filtered = employees.filter((e) => e.id !== id)
  if (filtered.length === employees.length) return false
  
  saveEmployees(filtered)
  return true
}

export function getEmployee(id: string): Employee | null {
  const employees = loadEmployees()
  return employees.find((e) => e.id === id) || null
}

// ─── Onboarding Duties ───────────────────────────────────────────────────────

export function toggleEmployeeDuty(employeeId: string, dutyId: string): Employee | null {
  const employee = getEmployee(employeeId)
  if (!employee) return null
  
  const updatedProgress = employee.onboardingProgress.map((duty) =>
    duty.id === dutyId
      ? {
          ...duty,
          isComplete: !duty.isComplete,
          completedAt: !duty.isComplete ? new Date().toISOString() : undefined,
        }
      : duty
  )
  
  return updateEmployee(employeeId, { onboardingProgress: updatedProgress })
}

// ─── Tax Documents ───────────────────────────────────────────────────────────

export function addTaxDocument(
  employeeId: string,
  document: Omit<TaxDocument, 'id' | 'uploadedAt'>
): Employee | null {
  const employee = getEmployee(employeeId)
  if (!employee) return null
  
  const newDoc: TaxDocument = {
    ...document,
    id: crypto.randomUUID(),
    uploadedAt: new Date().toISOString(),
  }
  
  return updateEmployee(employeeId, {
    taxDocuments: [...employee.taxDocuments, newDoc],
  })
}

export function updateTaxDocument(
  employeeId: string,
  documentId: string,
  updates: Partial<TaxDocument>
): Employee | null {
  const employee = getEmployee(employeeId)
  if (!employee) return null
  
  const updatedDocs = employee.taxDocuments.map((doc) =>
    doc.id === documentId ? { ...doc, ...updates } : doc
  )
  
  return updateEmployee(employeeId, { taxDocuments: updatedDocs })
}

export function deleteTaxDocument(employeeId: string, documentId: string): Employee | null {
  const employee = getEmployee(employeeId)
  if (!employee) return null
  
  const updatedDocs = employee.taxDocuments.filter((doc) => doc.id !== documentId)
  return updateEmployee(employeeId, { taxDocuments: updatedDocs })
}
