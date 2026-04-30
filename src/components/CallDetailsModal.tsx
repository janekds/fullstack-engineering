import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

function CallDetailsModal({
  callDetails,
  callDetailsLoading,
  callDetailsError,
  callDetailsOpen,
  setCallDetailsOpen,
}: {
  callDetails: any;
  callDetailsLoading: boolean;
  callDetailsError: string;
  callDetailsOpen: boolean;
  setCallDetailsOpen: (open: boolean) => void;
}) {
  return (
    <Dialog
      open={callDetailsOpen}
      onOpenChange={(open) => setCallDetailsOpen(open)}
      defaultOpen={true}
    >
      <DialogContent className="max-w-4xl w-full rounded-2xl shadow-2xl bg-gradient-to-br from-white via-blue-50 to-green-50 dark:from-gray-900 dark:via-blue-950/60 dark:to-green-950/60 border-0 p-0 overflow-hidden flex flex-col max-h-[90vh]">
        <DialogHeader className="bg-gradient-to-r from-blue-500/80 to-green-500/80 px-8 py-6 rounded-t-2xl shadow">
          <DialogTitle className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <svg
              className="w-7 h-7 text-white/80"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M8 12l2 2 4-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Call Details
          </DialogTitle>
          <DialogDescription className="text-white/80 text-base mt-1">
            Your mock interview summary and insights
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 flex flex-col md:flex-row gap-0 md:gap-0 h-full min-h-[400px]">
          {callDetailsLoading ? (
            <div className="flex items-center justify-center w-full py-12">
              <svg
                className="animate-spin h-7 w-7 text-blue-500 mr-3"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              <span className="text-muted-foreground text-lg">
                Loading call details...
              </span>
            </div>
          ) : callDetailsError ? (
            <div className="flex items-center justify-center w-full text-red-600 py-12">
              {callDetailsError}
            </div>
          ) : callDetails ? (
            <>
              {/* Left Pane: Details */}
              <div className="w-full md:w-[48%] flex-shrink-0 flex flex-col gap-6 p-6 md:p-8 overflow-y-auto max-h-[60vh] md:max-h-[calc(90vh-5rem)] border-b md:border-b-0 md:border-r border-muted-foreground/10">
                {/* Analysis Card */}
                <div className="bg-gradient-to-r from-blue-100/80 to-green-100/80 dark:from-blue-900/40 dark:to-green-900/40 rounded-xl shadow p-6 flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      className="w-5 h-5 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 20l9-5-9-5-9 5 9 5z" />
                      <path d="M12 12V4l8 4-8 4-8-4 8-4z" />
                    </svg>
                    <span className="font-semibold text-blue-700 dark:text-blue-200">
                      AI Analysis
                    </span>
                  </div>
                  <div className="text-gray-700 dark:text-gray-100 text-base whitespace-pre-line">
                    {callDetails.analysis?.summary || (
                      <span className="italic text-muted-foreground">
                        No summary available.
                      </span>
                    )}
                  </div>
                </div>
                {/* Meta Info */}
                <div className="grid grid-cols-2 md:grid-cols-1 gap-6">
                  {/* Recording */}
                  {callDetails?.stereoRecordingUrl && (
                    <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/30 dark:to-green-900/30 rounded-xl shadow p-6 flex flex-col gap-2">
                      <div className="flex items-center gap-2 mb-2">
                        <svg
                          className="w-5 h-5 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <rect x="9" y="9" width="6" height="6" rx="3" />
                          <path d="M15 15v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2" />
                        </svg>
                        <span className="font-semibold text-green-700 dark:text-green-200">
                          Recording
                        </span>
                      </div>
                      <audio
                        src={callDetails.stereoRecordingUrl}
                        controls
                        className="w-full rounded-lg border border-blue-200 dark:border-blue-800"
                      ></audio>
                    </div>
                  )}
                  <div>
                    <div className="text-xs text-muted-foreground uppercase font-semibold mb-1">
                      Status
                    </div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {callDetails.status ?? "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase font-semibold mb-1">
                      Started
                    </div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {callDetails.startedAt
                        ? new Date(callDetails.startedAt).toLocaleString()
                        : "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase font-semibold mb-1">
                      Ended
                    </div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {callDetails.endedAt
                        ? new Date(callDetails.endedAt).toLocaleString()
                        : "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase font-semibold mb-1">
                      Ended Reason
                    </div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {callDetails.endedReason ?? "-"}
                    </div>
                  </div>
                </div>
              </div>
              {/* Right Pane: Transcript */}
              <div className="w-full md:w-[52%] flex flex-col p-6 md:p-8 overflow-y-auto max-h-[60vh] md:max-h-[calc(90vh-5rem)]">
                <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/30 dark:to-green-900/30 rounded-xl shadow p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <svg
                      className="w-5 h-5 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                    <span className="font-semibold text-blue-700 dark:text-blue-200">
                      Conversation
                    </span>
                  </div>
                  <div className="flex-1 max-h-64 md:max-h-[calc(90vh-12rem)] overflow-y-auto flex flex-col gap-4 pr-2">
                    {callDetails?.messages &&
                    callDetails.messages.filter(
                      (message: any) => message.role !== "system"
                    ).length > 0 ? (
                      callDetails.messages
                        .filter((message: any) => message.role !== "system")
                        .map((message: any, index: number) => (
                          <div
                            key={index}
                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[80%] px-4 py-2 rounded-lg shadow-sm text-sm ${
                                message.role === "user"
                                  ? "bg-blue-500 text-white rounded-br-none"
                                  : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none"
                              }`}
                            >
                              <span className="block text-xs font-semibold mb-1 opacity-80">
                                {message.role === "user"
                                  ? "You"
                                  : "Interviewer"}
                              </span>
                              <span className="block">{message.message}</span>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        No conversation available.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center w-full py-12">
              <svg
                className="w-6 h-6 text-gray-400 mr-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <path d="M9.09 9a3 3 0 015.82 0" />
                <path d="M12 17h.01" />
              </svg>
              <span className="text-muted-foreground text-lg">
                No details available
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CallDetailsModal;
