"use client";

import React from "react";
import {
  Brain,
  AlertTriangle,
  CheckCircle,
  Info,
  TrendingUp,
} from "lucide-react";

interface Analysis {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  analysis: string;
  summary: string;
  impact: "high" | "medium" | "low" | "unknown";
  changes: Array<{
    type: string;
    line: string;
    lineNumber?: number;
  }>;
}

interface AnalysisPanelProps {
  analysis: Analysis;
}

export default function AnalysisPanel({ analysis }: AnalysisPanelProps) {
  const getImpactIcon = () => {
    switch (analysis.impact) {
      case "high":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case "medium":
        return <Info className="w-5 h-5 text-yellow-500" />;
      case "low":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <TrendingUp className="w-5 h-5 text-gray-500" />;
    }
  };

  const getImpactColor = () => {
    switch (analysis.impact) {
      case "high":
        return "bg-red-50 border-red-200";
      case "medium":
        return "bg-yellow-50 border-yellow-200";
      case "low":
        return "bg-green-50 border-green-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getImpactText = () => {
    switch (analysis.impact) {
      case "high":
        return "높은 영향도";
      case "medium":
        return "중간 영향도";
      case "low":
        return "낮은 영향도";
      default:
        return "영향도 미확인";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* 헤더 */}
      <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">AI 코드 분석</h3>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 요약 */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">요약</h4>
          <p className="text-gray-700 bg-gray-50 p-3 rounded border">
            {analysis.summary}
          </p>
        </div>

        {/* 영향도 */}
        <div className={`p-3 rounded border ${getImpactColor()}`}>
          <div className="flex items-center space-x-2 mb-2">
            {getImpactIcon()}
            <span className="font-medium">{getImpactText()}</span>
          </div>
        </div>

        {/* 변경 통계 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 p-3 rounded border border-green-200">
            <div className="text-sm text-green-600 font-medium">
              추가된 라인
            </div>
            <div className="text-2xl font-bold text-green-700">
              +{analysis.additions}
            </div>
          </div>
          <div className="bg-red-50 p-3 rounded border border-red-200">
            <div className="text-sm text-red-600 font-medium">삭제된 라인</div>
            <div className="text-2xl font-bold text-red-700">
              -{analysis.deletions}
            </div>
          </div>
        </div>

        {/* 상세 분석 */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">상세 분석</h4>
          <div className="bg-gray-50 p-4 rounded border">
            <div className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
              {analysis.analysis}
            </div>
          </div>
        </div>

        {/* 주요 변경사항 */}
        {analysis.changes.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              주요 변경사항 ({analysis.changes.length}개)
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {analysis.changes.slice(0, 10).map((change, index) => (
                <div
                  key={index}
                  className={`p-2 rounded border text-sm font-mono ${
                    change.type === "addition"
                      ? "bg-green-50 border-green-200 text-green-800"
                      : "bg-red-50 border-red-200 text-red-800"
                  }`}
                >
                  <span className="inline-block w-4">
                    {change.type === "addition" ? "+" : "-"}
                  </span>
                  {change.line.length > 100
                    ? `${change.line.substring(0, 100)}...`
                    : change.line}
                </div>
              ))}
              {analysis.changes.length > 10 && (
                <div className="text-sm text-gray-500 text-center py-2">
                  ... 그리고 {analysis.changes.length - 10}개 더
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
