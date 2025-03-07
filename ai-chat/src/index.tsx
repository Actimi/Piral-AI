import { MantineProvider, Space } from "@mantine/core";
import { emotionTransform, MantineEmotionProvider } from "@mantine/emotion";
import { MedplumClient } from "@medplum/core";
import { MedplumLink, MedplumProvider } from "@medplum/react";
import { IconUser } from "@tabler/icons-react";
import type { PiletApi } from "daiko-piral";
import * as React from "react";

const Page = React.lazy(() => import("./Page"));

export function setup(app: PiletApi) {
	const medplum: MedplumClient = app.getData("medplum");
	const mantinetheme = app.getData("mantinetheme");

	interface NavbarLinkProps {
		readonly to: string;
		readonly active: boolean;
		readonly onClick: React.MouseEventHandler;
		readonly children: React.ReactNode;
	}

	function NavbarLink(props: NavbarLinkProps): React.JSX.Element {
		return (
			<MedplumLink
				onClick={props.onClick}
				to={props.to}
				className="css-1dq80ci"
			>
				{props.children}
			</MedplumLink>
		);
	}

	interface NavLinkIconProps {
		readonly to: string;
		readonly icon?: React.JSX.Element;
	}

	function NavLinkIcon(props: NavLinkIconProps): React.JSX.Element {
		if (props.icon) {
			return props.icon;
		}
		return <Space w={30} />;
	}
	app.registerPage("/test/*", () => (
		<MedplumProvider medplum={medplum}>
			<MantineProvider theme={mantinetheme} stylesTransform={emotionTransform}>
				<MantineEmotionProvider>
					<Page />
				</MantineEmotionProvider>
			</MantineProvider>
		</MedplumProvider>
	));

	app.registerMenu(() => (
		<MedplumProvider medplum={medplum}>
			<MantineProvider theme={mantinetheme} stylesTransform={emotionTransform}>
				<MantineEmotionProvider>
					<React.Fragment key={"Test"}>
						<NavbarLink
							key={"Test"}
							to={"/test"}
							active={true}
							onClick={(e) => {
								e.preventDefault();
								window.location.href = "/test";
							}}
						>
							<NavLinkIcon to={"/test"} icon={<IconUser />} />
							<span>{"Test"}</span>
						</NavbarLink>
					</React.Fragment>
				</MantineEmotionProvider>
			</MantineProvider>
		</MedplumProvider>
	));
}
