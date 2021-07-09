import {IIndexPageData} from './IIndexPageData';

export interface IPageControllerAdapter {
    getIndexData(): Promise<IIndexPageData>;
}
