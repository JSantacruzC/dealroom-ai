import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  listCompanies,
  getCompanyFn,
  createCompany,
  updateCompany,
  deleteCompany,
  listStakeholders,
  upsertStakeholder,
  updateStakeholderStatus,
  deleteStakeholder,
  listActivity,
} from "@/lib/dealrooms.functions";

export function useCompanies() {
  const fn = useServerFn(listCompanies);
  return useQuery({ queryKey: ["companies"], queryFn: () => fn() });
}

export function useCompany(id: string | undefined) {
  const fn = useServerFn(getCompanyFn);
  return useQuery({
    queryKey: ["company", id],
    queryFn: () => fn({ data: { id: id! } }),
    enabled: !!id,
  });
}

export function useCreateCompany() {
  const fn = useServerFn(createCompany);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { name: string; domain?: string }) => fn({ data: vars }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["companies"] }),
  });
}

export function useUpdateCompany() {
  const fn = useServerFn(updateCompany);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; patch: Record<string, unknown> }) =>
      fn({ data: vars as never }),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["company", vars.id] });
      qc.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}

export function useDeleteCompany() {
  const fn = useServerFn(deleteCompany);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["companies"] }),
  });
}

export function useStakeholders(companyId: string | undefined) {
  const fn = useServerFn(listStakeholders);
  return useQuery({
    queryKey: ["stakeholders", companyId],
    queryFn: () => fn({ data: { companyId: companyId! } }),
    enabled: !!companyId,
  });
}

export function useUpsertStakeholder(companyId: string) {
  const fn = useServerFn(upsertStakeholder);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: Parameters<typeof fn>[0]["data"]) => fn({ data: vars }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["stakeholders", companyId] }),
  });
}

export function useUpdateStakeholderStatus(companyId: string) {
  const fn = useServerFn(updateStakeholderStatus);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; status: string }) => fn({ data: vars as never }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["stakeholders", companyId] }),
  });
}

export function useDeleteStakeholder(companyId: string) {
  const fn = useServerFn(deleteStakeholder);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["stakeholders", companyId] }),
  });
}

export function useActivity() {
  const fn = useServerFn(listActivity);
  return useQuery({ queryKey: ["activity"], queryFn: () => fn() });
}
