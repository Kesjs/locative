"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  type AlertDialogContentProps,
} from "@/components/ui/alert-dialog";

interface RadixAlertDialogDemoProps {
  from?: AlertDialogContentProps["from"];
}

export const RadixAlertDialogDemo = ({ from = "center" }: RadixAlertDialogDemoProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="btn-secondary" style={{ padding: "8px 16px", fontSize: 13 }}>
          Open Dialog
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent from={from} className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
