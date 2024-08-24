import I18nProvider from "@cloudscape-design/components/i18n";
import "./App.css";
import {
  AppLayout,
  BreadcrumbGroup,
  Container,
  ContentLayout,
  Header,
  HelpPanel,
  Link,
  SideNavigation,
  SplitPanel,
  TopNavigation,
} from "@cloudscape-design/components";
import messages from "@cloudscape-design/components/i18n/messages/all.all";

const LOCALE = "en";

function App() {
  return (
    <>
      <TopNavigation
        identity={{
          title: "Service name",
          href: "#",
        }}
      />
      <I18nProvider locale={LOCALE} messages={[messages]}>
        <AppLayout
          breadcrumbs={
            <BreadcrumbGroup
              items={[
                { text: "Hsome", href: "#" },
                { text: "Service", href: "#" },
              ]}
            />
          }
          navigationOpen={true}
          navigation={
            <SideNavigation
              header={{
                href: "#",
                text: "Service name",
              }}
              items={[{ type: "link", text: `Page #1`, href: `#` }]}
            />
          }
          toolsOpen={true}
          tools={<HelpPanel header={<h2>Overview</h2>}>Help content</HelpPanel>}
          content={
            <ContentLayout
              header={
                <>
                  <Header variant="h1" info={<Link variant="info">Info</Link>}>
                    Page header
                  </Header>
                </>
              }
            >
              <Container
                header={
                  <Header variant="h2" description="Container description">
                    Container header
                  </Header>
                }
              >
                <div className="contentPlaceholder" />
              </Container>
            </ContentLayout>
          }
          splitPanel={
            <SplitPanel header="Split panel header">
              Split panel content
            </SplitPanel>
          }
        />
      </I18nProvider>
    </>
  );
}

export default App;
