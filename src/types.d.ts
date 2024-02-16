export interface Page {
    id: string; 
    pageName: string; 
    title: string; 
    content: string; 
}

export interface PageApi {
    selectedPageId: string, 
    newPageName: string, 
    title: string, 
    content: string, 
    pageName: string
}