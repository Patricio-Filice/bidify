import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./alert";

export function ErrorAlert({
  title,
  error,
}: { title: string, error: Error }) {
  return (
      <Alert 
        title={title}
        variant="destructive"
        className="m-4"
      >
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Something Went Wrong</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
}