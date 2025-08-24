"use client";

import React from "react";
import { Calendar, GitCommit, User, FileText, Plus, Minus } from "lucide-react";

interface Commit {
  sha: string;
  shortSha: string;
  message: string;
  author: {
    name: string;
    email: string;
    date: string;
    avatar: string | null;
    username: string | null;
  };
  committer: {
    name: string;
    email: string;
    date: string;
  };
  url: string;
  stats: {
    total: number;
    additions: number;
    deletions: number;
  };
  files: number;
}

interface Repository {
  owner: string;
  repo: string;
  full_name: string;
  url: string;
}

interface CommitsListProps {
  repository: Repository;
  commits: Commit[];
  onCommitClick: (commit: Commit) => void;
  loading?: boolean;
}

export default function CommitsList({
  repository,
  commits,
  onCommitClick,
  loading = false,
}: CommitsListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1일 전";
    if (diffDays < 7) return `${diffDays}일 전`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)}주 전`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)}개월 전`;
    return `${Math.ceil(diffDays / 365)}년 전`;
  };

  const formatCommitMessage = (message: string) => {
    const firstLine = message.split("\n")[0];
    return firstLine.length > 60
      ? `${firstLine.substring(0, 60)}...`
      : firstLine;
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* 헤더 */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GitCommit className="w-5 h-5 text-gray-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                커밋 히스토리
              </h2>
              <p className="text-sm text-gray-600">{repository.full_name}</p>
            </div>
          </div>
          <span className="text-sm text-gray-500">
            {commits.length}개의 커밋
          </span>
        </div>
      </div>

      {/* 커밋 리스트 */}
      <div className="divide-y divide-gray-200">
        {commits.map((commit) => (
          <div
            key={commit.sha}
            onClick={() => onCommitClick(commit)}
            className="p-6 hover:bg-gray-50 cursor-pointer transition-colors group"
          >
            <div className="flex space-x-4">
              {/* 아바타 */}
              <div className="flex-shrink-0">
                {commit.author.avatar ? (
                  <img
                    src={commit.author.avatar}
                    alt={commit.author.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                )}
              </div>

              {/* 커밋 정보 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium group-hover:text-blue-600 transition-colors">
                      {formatCommitMessage(commit.message)}
                    </p>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{commit.author.name}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(commit.author.date)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <FileText className="w-3 h-3" />
                        <span>{commit.files}개 파일</span>
                      </span>
                    </div>
                  </div>

                  {/* SHA와 통계 */}
                  <div className="flex items-center space-x-4 ml-4">
                    {commit.stats.total > 0 && (
                      <div className="flex items-center space-x-2 text-sm">
                        {commit.stats.additions > 0 && (
                          <span className="flex items-center space-x-1 text-green-600">
                            <Plus className="w-3 h-3" />
                            <span>{commit.stats.additions}</span>
                          </span>
                        )}
                        {commit.stats.deletions > 0 && (
                          <span className="flex items-center space-x-1 text-red-600">
                            <Minus className="w-3 h-3" />
                            <span>{commit.stats.deletions}</span>
                          </span>
                        )}
                      </div>
                    )}
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                      {commit.shortSha}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {commits.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <GitCommit className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>커밋을 찾을 수 없습니다.</p>
        </div>
      )}
    </div>
  );
}
