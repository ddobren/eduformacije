import faqs from './faq';
import FAQItem from './FAQItem';

const FAQList = () => {
  return (
    <div className="space-y-6 sm:space-y-8">
      {faqs.map((faq, index) => (
        <FAQItem key={index} question={faq.question} answer={faq.answer} />
      ))}
    </div>
  );
};

export default FAQList;
