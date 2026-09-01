import * as React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
} from "@react-email/components";

export interface WelcomeEmailProps {
  name?: string;
  email?: string;
  branch?: string;
  yearOfStudy?: string;
  uidNumber?: string;
  portalUrl?: string;
}

export const WelcomeEmail = ({
  name = "Student",
  email = "student@univ.edu",
  branch = "Computer Science & Engineering",
  yearOfStudy = "III",
  uidNumber = "23CS01049",
  portalUrl = "https://stash-academic.vercel.app",
}: WelcomeEmailProps) => {
  return (
    <Html lang="en">
      <Head />
      <Preview>Your verified university credentials and Stash academic vault are ready.</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Badge */}
          <Section style={badgeContainer}>
            <Text style={badgeText}>STASH ✳︎ ACADEMIC VAULT</Text>
          </Section>

          {/* Heading */}
          <Text style={h1}>You&apos;re officially registered.</Text>
          <Text style={paragraph}>
            Welcome to Stash, <strong style={{ color: "#ffffff" }}>{name}</strong>. Your academic profile has been successfully authenticated and linked to your university vault.
          </Text>

          {/* Verified Credentials Card */}
          <Section style={card}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                <tr style={tableRow}>
                  <td style={tableLabel}>Student UID</td>
                  <td style={tableValue}>{uidNumber}</td>
                </tr>
                <tr style={tableRow}>
                  <td style={tableLabel}>Branch</td>
                  <td style={tableValue}>{branch}</td>
                </tr>
                <tr style={tableRow}>
                  <td style={tableLabel}>Year of Study</td>
                  <td style={tableValue}>Year {yearOfStudy}</td>
                </tr>
                <tr style={tableRow}>
                  <td style={tableLabel}>Email</td>
                  <td style={tableValue}>{email}</td>
                </tr>
                <tr>
                  <td style={tableLabel}>Account Status</td>
                  <td style={{ ...tableValue, color: "#34d399" }}>✓ Verified Student</td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Action CTA Button */}
          <Section style={btnContainer}>
            <Button style={btn} href={`${portalUrl}/dashboard`}>
              Open Your Academic Vault &rarr;
            </Button>
          </Section>

          <Hr style={divider} />

          {/* Anti-Spam Security & Org Footer */}
          <Text style={footer}>
            Stash Academic Portal &bull; Continuous Cloud Storage for Higher Education<br />
            You received this transactional security email because your email address was verified via Google/GitHub Single Sign-On.<br />
            Security ID: {uidNumber} &bull; Stash Inc. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

// Anti-spam high-end dark styling
const main = {
  backgroundColor: "#02040a",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  padding: "40px 0",
};

const container = {
  maxWidth: "560px",
  margin: "0 auto",
  backgroundColor: "#090d1a",
  borderRadius: "24px",
  border: "1px solid rgba(255, 255, 255, 0.12)",
  padding: "40px 36px",
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
};

const badgeContainer = {
  marginBottom: "20px",
};

const badgeText = {
  display: "inline-block",
  backgroundColor: "rgba(168, 85, 247, 0.15)",
  border: "1px solid rgba(168, 85, 247, 0.3)",
  color: "#c084fc",
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "1.5px",
  textTransform: "uppercase" as const,
  padding: "4px 12px",
  borderRadius: "9999px",
  margin: "0",
};

const h1 = {
  color: "#ffffff",
  fontSize: "26px",
  fontWeight: "800",
  letterSpacing: "-0.5px",
  margin: "0 0 14px 0",
};

const paragraph = {
  color: "#9ca3af",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0 0 24px 0",
};

const card = {
  backgroundColor: "#02040a",
  borderRadius: "16px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  padding: "20px 24px",
  marginBottom: "28px",
};

const tableRow = {
  borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
};

const tableLabel = {
  padding: "10px 0",
  color: "#6b7280",
  fontSize: "11px",
  fontWeight: "700",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  width: "40%",
};

const tableValue = {
  padding: "10px 0",
  color: "#ffffff",
  fontSize: "13px",
  fontWeight: "600",
  textAlign: "right" as const,
};

const btnContainer = {
  textAlign: "center" as const,
  marginBottom: "28px",
};

const btn = {
  display: "inline-block",
  backgroundColor: "#ffffff",
  color: "#000000",
  fontSize: "14px",
  fontWeight: "700",
  padding: "14px 28px",
  borderRadius: "9999px",
  textDecoration: "none",
  textAlign: "center" as const,
  boxShadow: "0 4px 14px rgba(255, 255, 255, 0.2)",
};

const divider = {
  borderTop: "1px solid rgba(255, 255, 255, 0.08)",
  margin: "24px 0",
};

const footer = {
  color: "#4b5563",
  fontSize: "11px",
  lineHeight: "1.6",
  textAlign: "center" as const,
  margin: "0",
};
