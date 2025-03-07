import React from "react";
import { MedplumProvider } from "@medplum/react";
import { MantineProvider, Container, Title, Button } from "@mantine/core";
import { MantineEmotionProvider, emotionTransform } from "@mantine/emotion";
import { theme } from "../theme";
import { medplum } from "..";

const NotFoundPage: React.FC = () => {
	return (
		<MedplumProvider medplum={medplum}>
			<MantineProvider theme={theme} stylesTransform={emotionTransform}>
				<MantineEmotionProvider>
					<Container
						style={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
							height: "70vh",
						}}
					>
						<Title pb={10} order={3}>
							404 - Page Not Found
						</Title>
						<Button onClick={() => (window.location.href = "/")}>
							Go to Dashboard
						</Button>
					</Container>
				</MantineEmotionProvider>
			</MantineProvider>
		</MedplumProvider>
	);
};

export default NotFoundPage;
