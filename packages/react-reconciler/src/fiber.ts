import { Props, Key, Ref } from 'shared/ReactTypes';
import { WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';
import { Container } from 'hostConfig';
export class FiberNode {
	type: any;
	tag: WorkTag;
	pendingProps: Props;
	key: Key;
	stateNode: any;
	ref: Ref;

	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	index: number;

	memoizedProps: Props | null;
	alternate: FiberNode | null;
	flags: Flags;
	updateQueue: unknown;

	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		//实例
		this.tag = tag;
		this.key = key;
		//HostComponent <div> div的dom
		this.stateNode = null;
		//如果是FunctionComponent type记录function本身
		this.type = null;

		//节点关系
		//只想父fibernode
		this.return = null;
		this.sibling = null;
		this.child = null;
		this.ref = null;

		//工作单元
		//工作前的props
		this.pendingProps = pendingProps;
		//工作后的prop
		this.memoizedProps = null;

		this.alternate = null;
		//副作用
		this.flags = NoFlags;
	}
}
export class FiberRootNode {
	container: Container;
	current: FiberNode;
	//整个更新完的hostRootFiber
	finishedWork: FiberNode | null;
	constructor(container: Container, hostRootFiber: FiberNode) {
		this.container = container;
		this.current = hostRootFiber;
		hostRootFiber.stateNode = this;
		this.finishedWork = null;
	}
}
