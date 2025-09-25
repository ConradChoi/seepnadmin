"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileSpreadsheet, Download, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

interface BulkUploadResult {
  success: number;
  failed: number;
  errors: string[];
}

interface BulkUploadDialogProps {
  onUploadComplete: () => void;
}

export default function BulkUploadDialog({ onUploadComplete }: BulkUploadDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<BulkUploadResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/categories/bulk-upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadResult(result.results);
        if (result.results.success > 0) {
          onUploadComplete(); // 카테고리 목록 새로고침
        }
      } else {
        setUploadResult({
          success: 0,
          failed: 1,
          errors: [result.error || '업로드 중 오류가 발생했습니다.']
        });
      }
    } catch {
      setUploadResult({
        success: 0,
        failed: 1,
        errors: ['네트워크 오류가 발생했습니다.']
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadSampleFile = () => {
    // 샘플 데이터 생성
    const sampleData = [
      ['카테고리명', '1Depth', '2Depth', '3Depth', '상태'],
      ['비품/소모품', '비품/소모품', '', '', 'active'],
      ['사무용품', '비품/소모품', '사무용품', '', 'active'],
      ['일반 사무용품', '비품/소모품', '사무용품', '일반 사무용품', 'active'],
      ['고급 사무용품', '비품/소모품', '사무용품', '고급 사무용품', 'active'],
      ['청소용품', '비품/소모품', '청소용품', '', 'active'],
      ['청소기', '비품/소모품', '청소용품', '청소기', 'active'],
      ['전자제품', '전자제품', '', '', 'active'],
      ['컴퓨터', '전자제품', '컴퓨터', '', 'active'],
      ['데스크톱', '전자제품', '컴퓨터', '데스크톱', 'active'],
      ['노트북', '전자제품', '컴퓨터', '노트북', 'active']
    ];

    // 워크북 생성
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(sampleData);
    
    // 컬럼 너비 설정
    ws['!cols'] = [
      { wch: 20 }, // 카테고리명
      { wch: 20 }, // 1Depth
      { wch: 20 }, // 2Depth
      { wch: 20 }, // 3Depth
      { wch: 10 }  // 상태
    ];

    XLSX.utils.book_append_sheet(wb, ws, '카테고리');
    
    // 파일 다운로드
    XLSX.writeFile(wb, '카테고리_일괄등록_샘플.xlsx');
  };

  const resetDialog = () => {
    setSelectedFile(null);
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(resetDialog, 300); // 다이얼로그 애니메이션 완료 후 리셋
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          일괄등록
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            카테고리 일괄등록
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 샘플 파일 다운로드 */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <h3 className="font-medium text-blue-900">샘플 파일 다운로드</h3>
              <p className="text-sm text-blue-700">엑셀 파일 형식을 확인하고 샘플 데이터를 다운로드하세요.</p>
            </div>
            <Button variant="outline" size="sm" onClick={downloadSampleFile} className="gap-2">
              <Download className="h-4 w-4" />
              샘플 다운로드
            </Button>
          </div>

          {/* 파일 업로드 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                엑셀 파일 선택
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {selectedFile && (
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <FileSpreadsheet className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{selectedFile.name}</span>
                <span className="text-xs text-gray-500">
                  ({(selectedFile.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            )}
          </div>

          {/* 업로드 결과 */}
          {uploadResult && (
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                {uploadResult.success > 0 && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">성공: {uploadResult.success}개</span>
                  </div>
                )}
                {uploadResult.failed > 0 && (
                  <div className="flex items-center gap-2 text-red-600">
                    <XCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">실패: {uploadResult.failed}개</span>
                  </div>
                )}
              </div>

              {uploadResult.errors.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-medium">오류 내용:</p>
                      {uploadResult.errors.map((error, index) => (
                        <p key={index} className="text-sm text-red-600">• {error}</p>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              닫기
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={!selectedFile || isUploading}
              className="gap-2"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  업로드 중...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  업로드
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
