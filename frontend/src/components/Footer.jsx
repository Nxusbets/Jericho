import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const linkVariants = {
    hover: { scale: 1.1, transition: { duration: 0.3 } },
  };

  return (
    <motion.footer
      variants={footerVariants}
      initial="hidden"
      animate="visible"
      style={{
        backgroundColor: 'yellow',
        color: 'black',
        fontFamily: 'Arial Narrow, sans-serif',
        textAlign: 'center',
        padding: '20px 1',
      }}
    >
      <div className="container-fluid mt-3 mb-3">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ marginRight: '20px' }}>
            <p>&copy; 2025 NxuS Bets</p>
          </div>
          
          </div>
        </div>
      
    </motion.footer>
  );
};

export default Footer;