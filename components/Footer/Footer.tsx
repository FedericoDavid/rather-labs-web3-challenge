import React from "react";

import {
  LinkedinOutlined,
  GithubOutlined,
  MailOutlined,
} from "@ant-design/icons";

import styles from "./styles.module.css";

const Footer = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>Enriquez Federico © 2023</div>
      <div className={styles.socialWrapper}>
        <a
          className={styles.socialLink}
          aria-label="Linkedin"
          href="https://www.linkedin.com/in/federico-d-enriquez/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <LinkedinOutlined size={22} />
        </a>
        <a
          className={styles.socialLink}
          aria-label="Github"
          href="https://github.com/FedericoDavid"
          rel="noopener noreferrer"
          target="_blank"
        >
          <GithubOutlined size={22} />
        </a>
        <a
          className={styles.socialLink}
          aria-label="Email"
          href="mailto:fedenri98@gmail.com"
          rel="noopener noreferrer"
          target="_blank"
        >
          <MailOutlined size={22} />
        </a>
      </div>
    </div>
  );
};

export default Footer;
