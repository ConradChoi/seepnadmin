"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, FolderPlus, Minus } from "lucide-react";
import { 
  getCategories, 
  createCategory, 
  updateCategory,
  deleteCategory,
  generateCategoryCode,
  CategoryItem 
} from "@/lib/categoryService";
import BulkUploadDialog from "@/components/category/BulkUploadDialog";

interface TreeNode {
  id: string;
  name: string;
  depth: number;
  parentId?: string;
  children: TreeNode[];
  isExpanded: boolean;
  categoryData?: CategoryItem;
}

export default function ItemsPage() {
  // const [items, setItems] = useState<CategoryItem[]>([]);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'addChild'>('create');
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryItem | null>(null);
  // const [rightPanelMode, setRightPanelMode] = useState<'view' | 'create' | 'edit' | 'addChild'>('view');
  const [formData, setFormData] = useState({
    categoryName: "",
    category1Depth: "",
    category2Depth: "",
    category3Depth: "",
    status: "active" as "active" | "inactive"
  });

  // 트리 노드 토글 핸들러
  const toggleNode = (nodeId: string) => {
    const updateTree = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, isExpanded: !node.isExpanded };
        }
        if (node.children.length > 0) {
          return { ...node, children: updateTree(node.children) };
        }
        return node;
      });
    };
    setTreeData(updateTree(treeData));
  };

  // 카테고리 선택 핸들러
  const handleCategorySelect = (category: CategoryItem) => {
    setSelectedCategory(category);
  };

  // 다이얼로그 열기 핸들러
  const openDialog = (mode: 'create' | 'edit' | 'addChild', category?: CategoryItem) => {
    setDialogMode(mode);
    
    if (mode === 'addChild' && category) {
      // 하위 카테고리 추가도 다이얼로그로 표시
      setSelectedCategory(category);
      
      // 하위 카테고리 생성 시 depth 설정
      const newCategory1Depth = category.category1Depth;
      let newCategory2Depth = category.category2Depth;
      let newCategory3Depth = category.category3Depth;
      
      if (category.category3Depth && category.category3Depth.trim() !== '') {
        // 3Depth의 하위는 생성할 수 없음 (최대 3Depth)
        console.warn('Cannot create child for 3Depth category');
        return;
      } else if (category.category2Depth && category.category2Depth.trim() !== '') {
        // 2Depth의 하위는 3Depth
        newCategory3Depth = ""; // 3Depth는 사용자가 입력
      } else if (category.category1Depth && category.category1Depth.trim() !== '') {
        // 1Depth의 하위는 2Depth
        newCategory2Depth = ""; // 2Depth는 사용자가 입력
        newCategory3Depth = ""; // 3Depth는 빈 값
      }
      
      setFormData({
        categoryName: "",
        category1Depth: newCategory1Depth,
        category2Depth: newCategory2Depth,
        category3Depth: newCategory3Depth,
        status: "active"
      });
      setIsDialogOpen(true);
    } else {
      // 새 카테고리 생성과 수정은 다이얼로그 사용
      if (mode === 'edit' && category) {
        setSelectedCategory(category);
        setFormData({
          categoryName: category.categoryName,
          category1Depth: category.category1Depth,
          category2Depth: category.category2Depth,
          category3Depth: category.category3Depth,
          status: category.status
        });
      } else {
        setFormData({
          categoryName: "",
          category1Depth: "",
          category2Depth: "",
          category3Depth: "",
          status: "active"
        });
      }
      setIsDialogOpen(true);
    }
  };

  // 데이터 로딩
  useEffect(() => {
    loadCategories();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadCategories = async () => {
    try {
      setLoading(true);
      console.log('Loading categories from Firebase...');
      
      // Firebase에서 실제 데이터 로드
      const categories = await getCategories();
      console.log('Loaded categories from Firebase:', categories);
      console.log('Categories count:', categories.length);
      
      if (categories.length === 0) {
        console.log('No categories found in Firebase database');
      } else {
        console.log('Found categories in Firebase:', categories.map(c => ({
          id: c.id,
          name: c.categoryName,
          code: c.categoryCode,
          status: c.status
        })));
      }
      
      buildTreeData(categories);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // 트리 데이터 구조 생성
  const buildTreeData = (categories: CategoryItem[]) => {
    console.log('Building tree from categories:', categories);
    
    if (!categories || categories.length === 0) {
      console.log('No categories found');
      setTreeData([]);
      return;
    }

    // 모든 카테고리를 노드로 변환
    const allNodes: TreeNode[] = categories.map(category => {
      // 깊이 계산
      let depth = 0;
      if (category.category1Depth && category.category1Depth.trim() !== '') {
        depth = 1;
        if (category.category2Depth && category.category2Depth.trim() !== '') {
          depth = 2;
          if (category.category3Depth && category.category3Depth.trim() !== '') {
            depth = 3;
          }
        }
      }

      return {
        id: category.id || category.categoryCode,
        name: category.categoryName,
        depth: depth,
        children: [],
        isExpanded: false,
        categoryData: category
      };
    });

    console.log('All nodes created:', allNodes.map(n => ({ name: n.name, depth: n.depth })));

    // 1Depth 카테고리들을 루트 노드로 설정
    const rootNodes: TreeNode[] = [];
    const nodeMap = new Map<string, TreeNode>();

    // 1Depth 노드들을 루트로 추가
    allNodes.forEach(node => {
      if (node.depth === 1) {
        rootNodes.push(node);
        nodeMap.set(node.id, node);
        console.log('Added 1Depth root node:', node.name);
      }
    });

    // 2Depth 노드들을 1Depth의 자식으로 추가
    allNodes.forEach(node => {
      if (node.depth === 2) {
        const category = node.categoryData!;
        // 1Depth 카테고리 이름으로 부모 찾기
        const parent = rootNodes.find(rootNode => 
          rootNode.categoryData?.category1Depth === category.category1Depth
        );
        
        if (parent) {
          parent.children.push(node);
          nodeMap.set(node.id, node);
          console.log('Added 2Depth node:', node.name, 'to parent:', parent.name);
        } else {
          console.log('Parent not found for 2Depth node:', node.name, 'parentName:', category.category1Depth);
        }
      }
    });

    // 3Depth 노드들을 2Depth의 자식으로 추가
    allNodes.forEach(node => {
      if (node.depth === 3) {
        const category = node.categoryData!;
        // 2Depth 카테고리 이름으로 부모 찾기
        const parent = allNodes.find(parentNode => 
          parentNode.depth === 2 && 
          parentNode.categoryData?.category1Depth === category.category1Depth &&
          parentNode.categoryData?.category2Depth === category.category2Depth
        );
        
        if (parent) {
          parent.children.push(node);
          nodeMap.set(node.id, node);
          console.log('Added 3Depth node:', node.name, 'to parent:', parent.name);
        } else {
          console.log('Parent not found for 3Depth node:', node.name, 'parentName:', `${category.category1Depth}-${category.category2Depth}`);
        }
      }
    });

    console.log('Final tree structure:', rootNodes);
    setTreeData(rootNodes);
  };

  // 사용하지 않는 함수들 제거됨


  // 삭제 확인 다이얼로그 열기
  const openDeleteDialog = (category: CategoryItem) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  // 카테고리 삭제 핸들러
  const handleDeleteCategory = async () => {
    if (!categoryToDelete?.id) return;
    
    try {
      await deleteCategory(categoryToDelete.id);
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
      
      // 선택된 카테고리가 삭제된 경우 선택 해제
      if (selectedCategory?.id === categoryToDelete.id) {
        setSelectedCategory(null);
      }
      
      await loadCategories(); // 데이터 새로고침
      console.log('Category deleted:', categoryToDelete.categoryName);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  // 사용하지 않는 함수 제거됨

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (dialogMode === 'edit' && selectedCategory) {
        // 수정 모드
        await updateCategory(selectedCategory.id!, {
          categoryName: formData.categoryName,
          category1Depth: formData.category1Depth,
          category2Depth: formData.category2Depth,
          category3Depth: formData.category3Depth,
          status: formData.status
        });
        
        console.log('Category updated:', formData.categoryName);
      } else {
        // 생성 모드
      const categoryCode = await generateCategoryCode(
        formData.category1Depth,
        formData.category2Depth,
        formData.category3Depth
      );

      await createCategory({
        categoryCode,
        categoryName: formData.categoryName,
        category1Depth: formData.category1Depth,
        category2Depth: formData.category2Depth,
        category3Depth: formData.category3Depth,
        status: formData.status
      });
        
        console.log('Category created:', formData.categoryName, 'with code:', categoryCode);
      }

      // 폼 초기화
      setFormData({
        categoryName: "",
        category1Depth: "",
        category2Depth: "",
        category3Depth: "",
        status: "active"
      });
      
      // 모든 모드에서 다이얼로그 닫기
      setIsDialogOpen(false);
      
      await loadCategories(); // 데이터 새로고침
      
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // 트리 노드 렌더링
  const renderTreeNode = (node: TreeNode, level: number = 0) => {
    const hasChildren = node.children.length > 0;
    const canAddChild = node.depth < 3;
    const isSelected = selectedCategory?.id === node.id;

    return (
      <div key={node.id} className="select-none">
        <div 
          className={`flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer rounded ${
            isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
          } ${
            node.categoryData?.status === 'inactive' ? 'opacity-60' : ''
          }`}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
        >
          {/* 확장/축소 아이콘 */}
          {hasChildren ? (
            <button
              onClick={() => toggleNode(node.id)}
              className="p-1 hover:bg-gray-200 rounded flex items-center justify-center w-6 h-6 text-gray-600"
            >
              {node.isExpanded ? (
                <Minus className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </button>
          ) : (
            <div className="w-6 h-6 flex items-center justify-center">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>
          )}

          {/* 카테고리 이름과 상태 */}
          <div 
            className="flex-1 flex items-center gap-2"
            onClick={() => node.categoryData && handleCategorySelect(node.categoryData)}
          >
            <span className={`text-sm font-medium ${
              node.categoryData?.status === 'inactive' ? 'text-gray-500' : ''
            }`}>
              {node.depth}Depth {node.name}
            </span>
            {node.categoryData && (
              <span 
                className={`px-2 py-1 text-xs rounded-full font-medium ${
                  node.categoryData.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {node.categoryData.status === 'active' ? '활성' : '비활성'}
              </span>
            )}
          </div>

          {/* 액션 버튼들 */}
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => node.categoryData && openDialog('edit', node.categoryData)}
              className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700"
              title="수정"
            >
              <Edit className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => node.categoryData && openDeleteDialog(node.categoryData)}
              className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
              title="삭제"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
            {canAddChild && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => node.categoryData && openDialog('addChild', node.categoryData)}
                className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                title="하위 카테고리 추가"
              >
                <FolderPlus className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>

        {/* 자식 노드들 */}
        {hasChildren && node.isExpanded && (
          <div>
            {node.children.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">표준 품목 카테고리</h1>
          <p className="text-gray-600 mt-2">표준 품목 코드와 정보를 관리하세요</p>
        </div>

        {/* 2단 레이아웃 */}
        <div className="grid grid-cols-5 gap-6 h-[calc(100vh-200px)]">
          {/* 왼쪽 영역 - 카테고리 트리 (40%) */}
          <div className="col-span-2">
            <Card className="h-full">
          <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>카테고리 트리</CardTitle>
                  <div className="flex gap-2">
                    <BulkUploadDialog onUploadComplete={loadCategories} />
                    <Button 
                      size="sm" 
                      onClick={() => openDialog('create')}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      새 카테고리
                    </Button>
              </div>
                </div>
              </CardHeader>
              <CardContent className="h-[calc(100%-80px)] overflow-y-auto">
                {loading ? (
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center gap-2 p-2">
                        <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-300 rounded flex-1 animate-pulse"></div>
                </div>
                    ))}
                </div>
                ) : treeData.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">📁</div>
                    <p>등록된 카테고리가 없습니다.</p>
                    <p className="text-sm mt-1">새 카테고리를 추가해보세요.</p>
              </div>
                ) : (
                  <div className="space-y-1">
                    {treeData.map(node => renderTreeNode(node, 0))}
              </div>
                )}
          </CardContent>
        </Card>
              </div>

          {/* 오른쪽 영역 - 뷰/수정/등록 (60%) */}
          <div className="col-span-3">
            <Card className="h-full">
              <CardContent className="h-full flex items-start justify-center p-6">
                {selectedCategory ? (
                  // 카테고리 상세 정보 뷰
                  <div className="w-full space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedCategory.categoryName}</h2>
                      <p className="text-gray-600">카테고리 상세 정보</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">카테고리 코드</Label>
                        <p className="text-lg font-mono bg-gray-100 p-2 rounded">{selectedCategory.categoryCode}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">상태</Label>
                        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${
                          selectedCategory.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            selectedCategory.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <span className="font-medium">
                            {selectedCategory.status === 'active' ? '활성' : '비활성'}
                          </span>
                        </div>
                    </div>
                    <div>
                        <Label className="text-sm font-medium text-gray-700">1Depth</Label>
                        <p className="text-lg bg-gray-100 p-2 rounded">{selectedCategory.category1Depth}</p>
                    </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">2Depth</Label>
                        <p className="text-lg bg-gray-100 p-2 rounded">{selectedCategory.category2Depth || '-'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">3Depth</Label>
                        <p className="text-lg bg-gray-100 p-2 rounded">{selectedCategory.category3Depth || '-'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">생성일</Label>
                        <p className="text-lg bg-gray-100 p-2 rounded">
                          {new Date(selectedCategory.createDate).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">수정일</Label>
                        <p className="text-lg bg-gray-100 p-2 rounded">
                          {selectedCategory.updateDate 
                            ? new Date(selectedCategory.updateDate).toLocaleDateString('ko-KR')
                            : '-'
                          }
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={() => openDialog('edit', selectedCategory)}
                        className="flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        수정
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => openDeleteDialog(selectedCategory)}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                        삭제
                      </Button>
                    </div>
                  </div>
                ) : (
                  // 기본 상태
                  <div className="text-center text-gray-500">
                    <div className="text-6xl mb-4">📁</div>
                    <h3 className="text-xl font-medium mb-2">카테고리를 선택하거나 새로 추가해주세요</h3>
                    <p className="text-sm">왼쪽 트리에서 카테고리를 선택하면 상세 정보를 확인할 수 있습니다.</p>
                    <Button 
                      className="mt-4"
                      onClick={() => openDialog('create')}
                    >
                      새 카테고리 추가
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 카테고리 추가/수정 다이얼로그 */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {dialogMode === 'create' ? '새 카테고리 추가' : 
                 dialogMode === 'edit' ? '카테고리 수정' : '하위 카테고리 추가'}
              </DialogTitle>
              <DialogDescription>
                {dialogMode === 'create' ? '새로운 표준 품목 카테고리를 추가하세요.' :
                 dialogMode === 'edit' ? '카테고리 정보를 수정하세요.' : '선택한 카테고리의 하위 카테고리를 추가하세요.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 하위 카테고리 추가 시에는 카테고리명만 입력 */}
              {dialogMode === 'addChild' ? (
                <div>
                  <Label htmlFor="categoryName">카테고리명</Label>
                  <Input
                    id="categoryName"
                    value={formData.categoryName}
                    onChange={(e) => {
                      const newName = e.target.value;
                      setFormData({...formData, categoryName: newName});
                      
                      // 하위 카테고리 추가 시 자동으로 해당 depth 필드에 입력
                      if (selectedCategory && selectedCategory.category2Depth === '') {
                        // 1Depth의 하위는 2Depth
                        setFormData(prev => ({...prev, categoryName: newName, category2Depth: newName}));
                      } else if (selectedCategory && selectedCategory.category2Depth !== '' && selectedCategory.category3Depth === '') {
                        // 2Depth의 하위는 3Depth
                        setFormData(prev => ({...prev, categoryName: newName, category3Depth: newName}));
                      }
                    }}
                    placeholder={
                      selectedCategory && selectedCategory.category2Depth === '' 
                        ? "2Depth 카테고리명을 입력하세요" 
                        : selectedCategory && selectedCategory.category2Depth !== '' && selectedCategory.category3Depth === ''
                        ? "3Depth 카테고리명을 입력하세요"
                        : "카테고리명을 입력하세요"
                    }
                    required
                  />
                  
                  {/* 부모 정보 표시 */}
                  <div className="mt-4 space-y-2">
                    <div>
                      <Label>1Depth</Label>
                      <div className="p-2 bg-gray-100 rounded text-sm text-gray-600">
                        {formData.category1Depth}
                      </div>
                    </div>
                    
                    {selectedCategory && selectedCategory.category2Depth !== '' && (
                      <div>
                        <Label>2Depth</Label>
                        <div className="p-2 bg-gray-100 rounded text-sm text-gray-600">
                          {formData.category2Depth}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : dialogMode === 'create' ? (
                // 새 카테고리 생성 시에는 카테고리명만 입력 (1Depth)
                <div>
                  <Label htmlFor="categoryName">카테고리명</Label>
                  <Input
                    id="categoryName"
                    value={formData.categoryName}
                    onChange={(e) => {
                      const newName = e.target.value;
                      setFormData({...formData, categoryName: newName, category1Depth: newName});
                    }}
                    placeholder="1Depth 카테고리명을 입력하세요"
                    required
                  />
                </div>
              ) : (
                // 수정 시에는 모든 필드 표시
                <>
                  <div>
                    <Label htmlFor="categoryName">카테고리명</Label>
                    <Input
                      id="categoryName"
                      value={formData.categoryName}
                      onChange={(e) => setFormData({...formData, categoryName: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category1Depth">1Depth</Label>
                    <Input
                      id="category1Depth"
                      value={formData.category1Depth}
                      onChange={(e) => setFormData({...formData, category1Depth: e.target.value})}
                      placeholder="1Depth 카테고리명을 입력하세요"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category2Depth">2Depth</Label>
                    <Input
                      id="category2Depth"
                      value={formData.category2Depth}
                      onChange={(e) => setFormData({...formData, category2Depth: e.target.value})}
                      placeholder="2Depth 카테고리명을 입력하세요"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category3Depth">3Depth</Label>
                    <Input
                      id="category3Depth"
                      value={formData.category3Depth}
                      onChange={(e) => setFormData({...formData, category3Depth: e.target.value})}
                      placeholder="3Depth 카테고리명을 입력하세요"
                    />
                  </div>
                </>
              )}
              
              
                    <div>
                <Label htmlFor="status">상태</Label>
                      <Select 
                        value={formData.status}
                  onValueChange={(value: "active" | "inactive") => setFormData({...formData, status: value})}
                      >
                        <SelectTrigger>
                    <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">활성</SelectItem>
                          <SelectItem value="inactive">비활성</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  취소
                </Button>
                <Button type="submit">
                  {dialogMode === 'create' ? '추가' : 
                   dialogMode === 'edit' ? '수정' : '추가'}
                </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

        {/* 삭제 확인 다이얼로그 */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>카테고리 삭제</DialogTitle>
              <DialogDescription>
                정말로 이 카테고리를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              </DialogDescription>
            </DialogHeader>
            {categoryToDelete && (
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-800">삭제할 카테고리</h4>
                  <p className="text-red-700 mt-1">{categoryToDelete.categoryName}</p>
                  <p className="text-sm text-red-600 mt-1">코드: {categoryToDelete.categoryCode}</p>
            </div>
                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDeleteDialogOpen(false)}
                  >
                    취소
                  </Button>
                  <Button 
                    type="button" 
                    variant="destructive"
                    onClick={handleDeleteCategory}
                  >
                    삭제
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}