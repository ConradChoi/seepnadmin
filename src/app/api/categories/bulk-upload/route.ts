import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { createCategory, generateCategoryCode } from '@/lib/categoryService';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: '파일이 선택되지 않았습니다.' },
        { status: 400 }
      );
    }

    // 파일 확장자 검증
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
      return NextResponse.json(
        { error: '엑셀 파일(.xlsx, .xls)만 업로드 가능합니다.' },
        { status: 400 }
      );
    }

    // 파일 읽기
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // JSON으로 변환
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    // 헤더 제거 (첫 번째 행)
    const dataRows = jsonData.slice(1) as string[][];
    
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    };

    // 각 행 처리
    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      const rowNumber = i + 2; // 엑셀 행 번호 (헤더 제외)
      
      try {
        // 필수 필드 검증
        if (!row[0] || !row[1]) {
          results.failed++;
          results.errors.push(`행 ${rowNumber}: 카테고리명과 1Depth는 필수입니다.`);
          continue;
        }

        const categoryName = row[0].toString().trim();
        const category1Depth = row[1].toString().trim();
        const category2Depth = row[2] ? row[2].toString().trim() : '';
        const category3Depth = row[3] ? row[3].toString().trim() : '';
        const status = row[4] ? row[4].toString().trim().toLowerCase() : 'active';
        
        // 상태 검증
        if (status !== 'active' && status !== 'inactive') {
          results.failed++;
          results.errors.push(`행 ${rowNumber}: 상태는 'active' 또는 'inactive'여야 합니다.`);
          continue;
        }

        // 카테고리 코드 생성
        const categoryCode = await generateCategoryCode(
          category1Depth,
          category2Depth,
          category3Depth
        );

        // 카테고리 생성
        await createCategory({
          categoryCode,
          categoryName,
          category1Depth,
          category2Depth,
          category3Depth,
          status: status as 'active' | 'inactive'
        });

        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(`행 ${rowNumber}: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
      }
    }

    return NextResponse.json({
      message: `일괄등록 완료: 성공 ${results.success}개, 실패 ${results.failed}개`,
      results
    });

  } catch (error) {
    console.error('Bulk upload error:', error);
    return NextResponse.json(
      { error: '파일 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
