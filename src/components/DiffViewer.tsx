"use client";

import React from "react";
import { FileText, Plus, Minus, RotateCcw } from "lucide-react";

interface DiffLine {
  type: "addition" | "deletion" | "context";
  line: string;
  lineNumber?: number;
  oldLineNumber?: number;
  newLineNumber?: number;
}

interface DiffViewerProps {
  filename: string;
  patch: string;
  status: string;
  additions: number;
  deletions: number;
}

export default function DiffViewer({
  filename,
  patch,
  status,
  additions,
  deletions,
}: DiffViewerProps) {
  const parsedLines = parsePatch(patch);

  const getStatusIcon = () => {
    switch (status) {
      case "added":
        return <Plus className="w-4 h-4 text-green-500" />;
      case "removed":
        return <Minus className="w-4 h-4 text-red-500" />;
      case "modified":
        return <RotateCcw className="w-4 h-4 text-blue-500" />;
      case "renamed":
        return <FileText className="w-4 h-4 text-purple-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "added":
        return "border-l-green-500 bg-green-50";
      case "removed":
        return "border-l-red-500 bg-red-50";
      case "modified":
        return "border-l-blue-500 bg-blue-50";
      case "renamed":
        return "border-l-purple-500 bg-purple-50";
      default:
        return "border-l-gray-500 bg-gray-50";
    }
  };

  return (
    <div
      className={`border border-gray-200 rounded-lg overflow-hidden ${getStatusColor()} border-l-4`}
    >
      {/* 파일 헤더 */}
      <div className="px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className="font-mono text-sm font-medium text-gray-800">
              {filename}
            </span>
            <span className="text-xs px-2 py-1 bg-gray-100  text-gray-800 rounded-full capitalize">
              {status}
            </span>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            {additions > 0 && (
              <span className="text-green-600">+{additions}</span>
            )}
            {deletions > 0 && (
              <span className="text-red-600">-{deletions}</span>
            )}
          </div>
        </div>
      </div>

      {/* Diff 내용 */}
      <div className="bg-white">
        {parsedLines.length > 0 ? (
          <div className="font-mono text-sm">
            {parsedLines.map((line, index) => (
              <div
                key={index}
                className={`flex ${
                  line.type === "addition"
                    ? "bg-green-50"
                    : line.type === "deletion"
                    ? "bg-red-50"
                    : "bg-white"
                }`}
              >
                <div className="w-16 px-2 py-1 text-gray-500 text-right border-r border-gray-200 bg-gray-50 select-none">
                  {line.oldLineNumber || ""}
                </div>
                <div className="w-16 px-2 py-1 text-gray-500 text-right border-r border-gray-200 bg-gray-50 select-none">
                  {line.newLineNumber || ""}
                </div>
                <div className="flex-1 px-2 py-1">
                  <span
                    className={`${
                      line.type === "addition"
                        ? "text-green-800"
                        : line.type === "deletion"
                        ? "text-red-800"
                        : "text-gray-800"
                    }`}
                  >
                    {line.line}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-gray-500 text-center">
            변경사항이 없거나 바이너리 파일입니다.
          </div>
        )}
      </div>
    </div>
  );
}

function parsePatch(patch: string): DiffLine[] {
  if (!patch) return [];

  const lines = patch.split("\n");
  const result: DiffLine[] = [];
  let oldLineNumber = 0;
  let newLineNumber = 0;

  for (const line of lines) {
    if (line.startsWith("@@")) {
      // 헤더 라인에서 라인 번호 정보 추출
      const match = line.match(/@@ -(\d+),?\d* \+(\d+),?\d* @@/);
      if (match) {
        oldLineNumber = parseInt(match[1]) - 1;
        newLineNumber = parseInt(match[2]) - 1;
      }
      continue;
    }

    if (line.startsWith("+++") || line.startsWith("---")) {
      continue;
    }

    if (line.startsWith("+")) {
      newLineNumber++;
      result.push({
        type: "addition",
        line: line.substring(1),
        newLineNumber: newLineNumber,
      });
    } else if (line.startsWith("-")) {
      oldLineNumber++;
      result.push({
        type: "deletion",
        line: line.substring(1),
        oldLineNumber: oldLineNumber,
      });
    } else {
      oldLineNumber++;
      newLineNumber++;
      result.push({
        type: "context",
        line: line.substring(1),
        oldLineNumber: oldLineNumber,
        newLineNumber: newLineNumber,
      });
    }
  }

  return result;
}
