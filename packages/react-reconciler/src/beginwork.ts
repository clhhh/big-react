import { ReactElementType } from 'shared/ReactTypes';
import { mountChildFibers, reconcileChildFibers } from './childFibers';
import { createWorkInProgress, FiberNode } from './fiber';
import { processUpdateQueue, UpdateQueue } from './updateQueue';
import { HostComponent, HostRoot, HostText } from './workTags';

export const beginWork = (wip: FiberNode) => {
	//比较
	//返回子fiberWork
	switch (wip.tag) {
		case HostRoot:
			return updateHostRoot(wip);
		case HostComponent:
			return updateHostComponent(wip);
		case HostText:
			return null;
		default:
			if (__DEV__) {
				console.warn('beginwork未实现类型');
			}
			break;
	}
	return null;
};

function updateHostRoot(wip: FiberNode) {
	const baseState = wip.memoizedState;
	const updateQueue = wip.updateQueue as UpdateQueue<Element>;
	const pending = updateQueue.shared.pending;
	updateQueue.shared.pending = null;
	const { memoizedState } = processUpdateQueue(baseState, pending);
	wip.memoizedState = memoizedState;

	//对于hostRoot来说 memoizedState是<App/>
	//也是子ReactElement
	const nextChildren = wip.memoizedState;
	//第二步:创建子fiberNode
	//通过对比子currentFiberNode与子ReactElement
	//生成子对应的workInProgressFiberNode
	reconcileChildren(wip, nextChildren);
	//返回子currentFiberNode
	return wip.child;
}

//创建子fiberNode
function updateHostComponent(wip: FiberNode) {
	const nextProps = wip.pendingProps;
	const nextChildren = nextProps.children;
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

function reconcileChildren(wip: FiberNode, children?: ReactElementType) {
	const current = wip.alternate;
	//为什么current！==null 是update
	//为什么mount的时候不追踪副作用 初次mount有大量的插入操作为什么不标记placement
	//怎么把例子的五次插入优化成一次

	//mount的时候不做插入标记 只做构建操作
	//在update的时候才做插入
	if (current !== null) {
		//update
		wip.child = reconcileChildFibers(wip, current?.child, children);
	} else {
		//mount
		wip.child = mountChildFibers(wip, null, children);
	}
}
