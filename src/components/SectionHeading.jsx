import React from "react";
import { motion } from "framer-motion";

export default function SectionHeading({ tag, title, lead, align = "center" }) {
  return (
    <motion.div
      className="section-header"
      style={{ textAlign: align, margin: align === "left" ? "0 0 2.5rem 0" : "0 auto 3.5rem auto" }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {tag && <div className="section-tag">{tag}</div>}
      <h2 className="section-title text-gradient-cosmic" style={{ whiteSpace: "pre-line" }}>
        {title}
      </h2>
      {lead && <p className="section-lead">{lead}</p>}
    </motion.div>
  );
}
