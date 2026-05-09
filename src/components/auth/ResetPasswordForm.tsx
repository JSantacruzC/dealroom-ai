import { Link } from "@tanstack/react-router";
import { AuthShell } from "./AuthShell";

export function ResetPasswordForm() {
  return (
    <AuthShell
      title="Password reset"
      subtitle="This demo runs in mock mode."
      footer={<Link to="/login" className="text-primary hover:underline">Back to sign in</Link>}
    >
      <p className="text-sm text-muted-foreground">
        Authentication runs locally for the demo, so password resets aren't needed. Just sign in again with any email
        and password.
      </p>
    </AuthShell>
  );
}
