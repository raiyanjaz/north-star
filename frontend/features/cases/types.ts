import type { Incident, IntakeDraft } from "../../types";
import type { Workspace } from "../../useWorkspace";
export interface CaseSections {
  details: Set<string>;
  onDetail: (name: string, open: boolean) => void;
}
export interface CaseProps extends CaseSections {
  workspace: Workspace;
  incident: Incident;
}
export interface IntakeProps extends CaseProps {
  draft: IntakeDraft | undefined;
  setDraft: (draft: IntakeDraft | undefined) => void;
  picking: boolean;
  onPick: () => void;
}
export interface CaseDetailsProps extends IntakeProps {
  request: string;
  setRequest: (request: string) => void;
}
