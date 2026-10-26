import React from "react";
import { motion } from "framer-motion";
import { HelpCircle, Sparkles, Compass, Search } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import { MYSTERIES_CONTENT } from "../data/scienceContent";

export default function MysteriesSection() {
  return (
    <section id="mysteries" className="section-padding" style={{ position: "relative" }}>
      <div className="container">
        <SectionHeading
          tag={MYSTERIES_CONTENT.tag}
          title={MYSTERIES_CONTENT.heading}
          lead={MYSTERIES_CONTENT.lead}
        />

        <div className="mysteries-grid">
          {MYSTERIES_CONTENT.questions.map((item, index) => (
            <motion.div
              key={item.number}
              className="mystery-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <div className="mystery-num">{item.number}</div>
              <h3 className="mystery-title">{item.question}</h3>
              <p style={{ fontSize: "0.88rem", color: "#94a3b8", lineHeight: 1.65, marginBottom: "1.5rem" }}>
                {item.context}
              </p>

              <div
                style={{
                  padding: "1rem",
                  borderRadius: "var(--radius-sm)",
                  background: "rgba(157, 78, 221, 0.08)",
                  border: "1px solid rgba(157, 78, 221, 0.2)",
                  marginTop: "auto",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.35rem" }}>
                  <Search size={13} color="#00f5d4" />
                  <span style={{ fontSize: "0.72rem", color: "#00f5d4", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Active Investigations
                  </span>
                </div>
                <p style={{ fontSize: "0.8rem", color: "#cbd5e1", margin: 0, lineHeight: 1.5 }}>
                  {item.currentEfforts}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
