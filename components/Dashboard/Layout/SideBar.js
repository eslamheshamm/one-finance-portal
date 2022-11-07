import React, { useState } from "react";
// import styled from "styled-components";
import { motion, useSpring } from "framer-motion";

const Sidebar = ({ width = 320, color = "#1c2022", children }) => {
	const [isOpen, setOpen] = useState(false);
	const x = useSpring(0, { stiffness: 400, damping: 40 });

	return (
		<motion.div
			dir="ltr"
			onPan={(e, pointInfo) => {
				if (pointInfo.point.x < width) x.set(pointInfo.point.x - width);
			}}
			onPanEnd={(e, pointInfo) => {
				if (Math.abs(pointInfo.velocity.x) > 1000 && !isOpen) {
					if (pointInfo.velocity.x > 0) {
						x.set(0);
					} else x.set(-width);
				} else {
					if (Math.abs(x.current) < width / 2) {
						x.set(0);
						// setOpen(true)
					} else {
						x.set(-width);
						// setOpen(false)
					}
				}
			}}
			className=" z-[99999999] fixed h-scree w-full"
		>
			<motion.button
				onTap={() => {
					setOpen(!isOpen);
					isOpen ? x.set(-width) : x.set(0);
				}}
				className="fixed text-red-500 z-[9999999999]"
			>
				open
			</motion.button>
			<motion.div
				width={width}
				transition={{
					type: "spring",
					stiffness: 400,
					damping: 40,
				}}
				initial={{ x: -width }}
				style={{ x }}
				className="bg-black w-[320px] p-8 fixed top-0 h-screen"
			>
				{children}
			</motion.div>
		</motion.div>
	);
};

export default Sidebar;
