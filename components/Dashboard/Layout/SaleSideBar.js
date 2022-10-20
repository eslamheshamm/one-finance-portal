// import { Accordion } from "flowbite-react";
import { SideBarAccordion } from "../../Atomics/Accordion";
import ActiveLink from "../../Atomics/ActiveLink";

export const SaleSideBar = () => {
	return (
		<ul className="w-full  space-y-4 flex flex-col  mt-8 ">
			<li className="w-full text-xl ">
				<SideBarAccordion
					title="العملاء"
					icon={CustomersIcon}
					content={
						<>
							<ul className="flex flex-col space-y-4">
								<ActiveLink activeClassName="text-black" href="/customers/add">
									<a className=" text-xl text-[#9E9E9E]">إضافة عميل</a>
								</ActiveLink>
								<ActiveLink
									activeClassName="text-white"
									href="/customers/queue"
								>
									<a className=" text-xl  text-gray-400"> قائمة العملاء</a>
								</ActiveLink>
							</ul>
						</>
					}
				/>
			</li>
			<li className="w-full text-xl ">
				<SideBarAccordion
					title="التمويلات"
					icon={LoansIcon}
					content={
						<ul className="flex flex-col space-y-3">
							<li>
								<ActiveLink
									activeClassName="text-[#EDAA00] font-semibold"
									href="/loans/add"
								>
									<a className=" text-xl ">الشركاء</a>
								</ActiveLink>
							</li>
							<li>
								<ActiveLink
									activeClassName="text-[#EDAA00] font-semibold"
									href="/loans/approved"
								>
									<a className=" text-xl ">التمويلات المقبولة</a>
								</ActiveLink>
							</li>
							<li>
								<ActiveLink
									activeClassName="text-[#EDAA00] font-semibold"
									href="/loans/rejected"
								>
									<a className=" text-xl ">التمويلات المرفوضة</a>
								</ActiveLink>
							</li>
							{/* <li>
								<ActiveLink
									activeClassName="text-[#EDAA00] font-semibold"
									href="/shared/loans/rejected"
								>
									<a className=" text-xl ">المرفوضة</a>
								</ActiveLink>
							</li>
							<li>
								<ActiveLink
									activeClassName="text-[#EDAA00] font-semibold"
									href="/shared/loans/approved"
								>
									<a className=" text-xl ">المقبولة</a>
								</ActiveLink>
							</li> */}
						</ul>
					}
				/>
			</li>
		</ul>
	);
};
const CustomersIcon = (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<circle cx="7" cy="6" r="3" stroke="currentColor" strokeWidth="2" />
		<circle cx="16.5" cy="8.5" r="2.5" stroke="currentColor" strokeWidth="2" />
		<path
			d="M1 18C1 14.6863 3.68629 12 7 12V12C10.3137 12 13 14.6863 13 18V20H1V18Z"
			stroke="currentColor"
			strokeWidth="2"
		/>
		<path
			d="M12.5374 15.6858L11.6149 16.0718L11.3613 15.4656L11.8171 14.9922L12.5374 15.6858ZM13 20L13 21L12 21V20H13ZM13.3571 20L13.3571 19H13.3571V20ZM22 20H23V21H22V20ZM12 18C12 17.3146 11.8627 16.6638 11.6149 16.0718L13.4599 15.2998C13.8081 16.132 14 17.0449 14 18H12ZM12 20V18H14V20H12ZM13 19L13.3571 19L13.3571 21L13 21L13 19ZM13.3571 19H22V21H13.3571V19ZM21 20V19.5H23V20H21ZM21 19.5C21 17.0147 18.9853 15 16.5 15V13C20.0899 13 23 15.9101 23 19.5H21ZM16.5 15C15.2263 15 14.0777 15.5278 13.2578 16.3794L11.8171 14.9922C12.9983 13.7653 14.6606 13 16.5 13V15Z"
			fill="currentColor"
		/>
	</svg>
);
const LoansIcon = (
	<svg
		width="24"
		height="24"
		viewBox="0 0 26 26"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M5.00756 4.34128L5.00221 4.34276C4.9741 4.35 4.94809 4.35978 4.9324 4.36567L4.92975 4.36667L4.92944 4.36678C3.31942 4.97362 2.26029 5.55927 1.60754 6.43434L1.60744 6.43448C0.955853 7.3096 0.820109 8.35141 0.817857 9.53566V9.53605V9.53608V9.53612V9.53616V9.5362V9.53624V9.53628V9.53632V9.53636V9.5364V9.53644V9.53647V9.53651V9.53655V9.53659V9.53663V9.53667V9.53671V9.53674V9.53678V9.53682V9.53686V9.5369V9.53693V9.53697V9.53701V9.53705V9.53709V9.53712V9.53716V9.5372V9.53724V9.53728V9.53731V9.53735V9.53739V9.53743V9.53746V9.5375V9.53754V9.53758V9.53761V9.53765V9.53769V9.53772V9.53776V9.5378V9.53784V9.53787V9.53791V9.53795V9.53798V9.53802V9.53806V9.53809V9.53813V9.53817V9.53821V9.53824V9.53828V9.53831V9.53835V9.53839V9.53842V9.53846V9.5385V9.53853V9.53857V9.53861V9.53864V9.53868V9.53871V9.53875V9.53879V9.53882V9.53886V9.53889V9.53893V9.53897V9.539V9.53904V9.53907V9.53911V9.53914V9.53918V9.53922V9.53925V9.53929V9.53932V9.53936V9.53939V9.53943V9.53946V9.5395V9.53954V9.53957V9.53961V9.53964V9.53968V9.53971V9.53975V9.53978V9.53982V9.53985V9.53989V9.53992V9.53996V9.53999V9.54003V9.54006V9.5401V9.54013V9.54017V9.5402V9.54024V9.54027V9.54031V9.54034V9.54037V9.54041V9.54044V9.54048V9.54051V9.54055V9.54058V9.54062V9.54065V9.54068V9.54072V9.54075V9.54079V9.54082V9.54086V9.54089V9.54092V9.54096V9.54099V9.54103V9.54106V9.54109V9.54113V9.54116V9.5412V9.54123V9.54126V9.5413V9.54133V9.54137V9.5414V9.54143V9.54147V9.5415V9.54154V9.54157V9.5416V9.54164V9.54167V9.5417V9.54174V9.54177V9.54181V9.54184V9.54187V9.54191V9.54194V9.54197V9.54201V9.54204V9.54207V9.54211V9.54214V9.54217V9.54221V9.54224V9.54227V9.54231V9.54234V9.54237V9.54241V9.54244V9.54247V9.54251V9.54254V9.54257V9.54261V9.54264V9.54267V9.54271V9.54274V9.54277V9.54281V9.54284V9.54287V9.54291V9.54294V9.54297V9.543V9.54304V9.54307V9.5431V9.54314V9.54317V9.5432V9.54324V9.54327V9.5433V9.54333V9.54337V9.5434V9.54343V9.54347V9.5435V9.54353V9.54356V9.5436V9.54363V9.54366V9.5437V9.54373V9.54376V9.54379V9.54383V9.54386V9.54389V9.54393V9.54396V9.54399V9.54402V9.54406V9.54409V9.54412V9.54416V9.54419V9.54422V9.54425V9.54429V9.54432V9.54435V9.54438V9.54442V9.54445V9.54448V9.54452V9.54455V9.54458V9.54461V9.54465V9.54468V9.54471V9.54474V9.54478V9.54481V9.54484V9.54488V9.54491V9.54494V9.54497V9.54501V9.54504V9.54507V9.5451V9.54514V9.54517V9.5452V9.54524V9.54527V9.5453V9.54533V9.54537V9.5454V9.54543V9.54546V9.5455V9.54553V9.54556V9.5456V9.54563V9.54566V9.54569V9.54573V9.54576V9.54579V9.54582V9.54586V9.54589V9.54592V9.54596V9.54599V9.54602V9.54605V9.54609V9.54612V9.54615V9.54619V9.54622V9.54625V9.54628V9.54632V9.54635V9.54638V9.54642V9.54645V9.54648V9.54651V9.54655V9.54658V9.54661V9.54665V9.54668V9.54671V9.54674V9.54678V9.54681V9.54684V9.54688V9.54691V9.54694V9.54698V9.54701V9.54704V9.54708V9.54711V9.54714V9.54717V9.54721V9.54724V9.54727V9.54731V9.54734V9.54737V9.54741V9.54744V9.54747V9.54751V9.54754V9.54757V9.54761V9.54764V9.54767V9.54771V9.54774V9.54777V9.54781V9.54784V9.54787V9.54791V9.54794V9.54797V9.54801V9.54804V9.54807V9.54811V9.54814V9.54818V9.54821V9.54824V9.54828V9.54831V9.54834V9.54838V9.54841V9.54845V9.54848V9.54851V9.54855V9.54858V9.54861V9.54865V9.54868V9.54872V9.54875V9.54878V9.54882V9.54885V9.54889V9.54892V9.54895V9.54899V9.54902V9.54906V9.54909V9.54913V9.54916V9.54919V9.54923V9.54926V9.5493V9.54933V9.54937V9.5494V9.54943V9.54947V9.5495V9.54954V9.54957V9.54961V9.54964V9.54968V9.54971V9.54975V9.54978V9.54982V9.54985V9.54989V9.54992V9.54996V9.54999V9.55002V9.55006V9.5501V9.55013V9.55017V9.5502V9.55024V9.55027V9.55031V9.55034V9.55038V9.55041V9.55045V9.55048V9.55052V9.55055V9.55059V9.55062V9.55066V9.5507V9.55073V9.55077V9.5508V9.55084V9.55087V9.55091V9.55095V9.55098V9.55102V9.55105V9.55109V9.55112V9.55116V9.5512V9.55123V9.55127V9.5513V9.55134V9.55138V9.55141V9.55145V9.55149V9.55152V9.55156V9.5516V9.55163V9.55167V9.55171V9.55174V9.55178V9.55182V9.55185V9.55189V9.55193V9.55196V9.552V9.55204V9.55207V9.55211V9.55215V9.55219V9.55222V9.55226V9.5523V9.55233V9.55237V9.55241V9.55245V9.55248V9.55252V9.55256V9.5526V9.55263V9.55267V9.55271V9.55275V9.55278V9.55282V9.55286V9.5529V9.55294V9.55297V9.55301V9.55305V9.55309V9.55313V9.55317V9.5532V9.55324V9.55328V9.55332V9.55336V9.5534V9.55343V9.55347V9.55351V9.55355V9.55359V9.55363V9.55367V9.55371V9.55375V9.55378V9.55382V9.55386V9.5539V9.9013C0.816709 9.91262 0.81529 9.92532 0.813757 9.93903C0.807751 9.99277 0.8 10.0621 0.8 10.1253V22.3395C0.8 24.2156 2.33819 25.7538 4.21427 25.7538H21.7856C23.6617 25.7538 25.1999 24.2156 25.1999 22.3395V10.036C25.1999 8.09661 23.4731 6.49678 21.5713 6.49678H4.42855C4.23131 6.49678 4.03974 6.51315 3.8547 6.54416C4.25333 6.31709 4.76706 6.08157 5.42821 5.83015L5.42827 5.83031L5.4359 5.82704C5.44424 5.82347 5.45158 5.81997 5.45827 5.81655C5.46085 5.81522 5.46327 5.81394 5.46538 5.8128C5.47167 5.81107 5.47944 5.80892 5.48865 5.80637C6.20426 5.60866 15.6407 3.00141 17.283 2.56878L17.2831 2.56876C17.8475 2.41988 18.2519 2.34728 18.5208 2.34321C18.8048 2.33891 18.8872 2.38482 18.8995 2.3938C18.9046 2.39754 18.9474 2.42981 19.002 2.65469C19.0523 2.86217 19.0856 3.19445 19.0856 3.64322V5.55393V5.75393H19.2856H20.4285H20.6285V5.55393V3.64322C20.6285 3.14028 20.5969 2.70294 20.4979 2.29273C20.3982 1.87967 20.1978 1.44794 19.8163 1.16181C19.4363 0.876771 18.9657 0.793372 18.4969 0.800404C18.0253 0.807479 17.5128 0.910954 16.8953 1.07487C16.0132 1.3074 13.0386 2.12475 10.2864 2.88345C8.90978 3.26293 7.58824 3.6279 6.61086 3.89799L5.43902 4.22194L5.11444 4.31172L5.02933 4.33526L5.00756 4.34128ZM2.91904 8.77412L2.91924 8.77388C3.29838 8.33466 3.80455 8.03963 4.42855 8.03963H21.5713C22.0647 8.03963 22.589 8.28729 22.9937 8.67396C23.3988 9.06106 23.657 9.56113 23.657 10.036V22.3395C23.657 23.3764 22.8224 24.211 21.7856 24.211H4.21427C3.17518 24.211 2.34285 23.3786 2.34285 22.3395V10.9665L2.36054 10.0289C2.39218 9.68153 2.57454 9.17193 2.91904 8.77412ZM20.7142 14.4967C19.8135 14.4967 19.0856 15.2247 19.0856 16.1253C19.0856 17.0259 19.8135 17.7539 20.7142 17.7539C21.6124 17.7539 22.3427 17.0261 22.3427 16.1253C22.3427 15.2245 21.6124 14.4967 20.7142 14.4967Z"
			fill="currentColor"
			stroke="currentColor"
			strokeWidth="0.4"
		/>
	</svg>
);
