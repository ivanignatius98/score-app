export function clickOutside(node: HTMLElement) {
	const handleClick = (event: MouseEvent | TouchEvent) => {
		if (event && !node.contains(event.target as Node)) {
			node.dispatchEvent(new CustomEvent('outclick'));
		}
	};

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
}
