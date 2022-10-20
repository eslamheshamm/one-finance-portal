import Image from "next/image";

export const Logo = () => {
	return (
		<div className=" flex items-center">
			<Image src="/logo.png" alt="Almasria Logo" width={64} height={48} />
			<p className="text-2xl   font-bold mr-3">وان فاينانس</p>
		</div>
	);
};
