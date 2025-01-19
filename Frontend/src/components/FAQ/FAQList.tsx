import { motion } from "framer-motion";
import faqData from "./faq";
import FAQItem from "./FAQItem";

const FAQList = () => {
  return (
    <motion.div
      className="space-y-4 sm:space-y-6 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {faqData.map((faq, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <FAQItem question={faq.question} answer={faq.answer} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FAQList;
