import React from "react";
import "./Modal.css";

interface Props {
	children: (JSX.Element | null)[] | JSX.Element;
	style?: React.CSSProperties;
}

interface ConstructorArgs {
	isActive: boolean;
	closeOnOutsideClick: boolean;
}

const defaultArgs: ConstructorArgs = {
	isActive: false,
	closeOnOutsideClick: true,
};

function ModalConstructor(args?: Partial<ConstructorArgs>) {
	args = { ...defaultArgs, ...args };
	const [isOpen, setIsOpen] = React.useState(args.isActive);

	const Modal = (props: Props) => {
		const style: React.CSSProperties = { display: isOpen ? "" : "none" };

		return (
			<div
				className="modal"
				style={{ ...props.style, ...style }}
				onClick={() => {
					if (args?.closeOnOutsideClick) setIsOpen(false);
				}}
			>
				<div className="internal_modal" onClick={(e) => e.stopPropagation()}>
					{props.children}
				</div>
			</div>
		);
	};

	return { Modal, setIsOpen };
}

export type Modal = ReturnType<typeof ModalConstructor>;
export default ModalConstructor;
