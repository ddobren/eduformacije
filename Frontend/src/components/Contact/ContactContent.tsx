import type React from "react"
import { Mail, Sparkles, MessageCircle, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

interface ContactMethodProps {
  icon: React.ElementType
  title: string
  description: string
  href: string
  linkLabel: string
}

const ContactMethod: React.FC<ContactMethodProps> = ({ icon: Icon, title, description, href, linkLabel }) => {
  return (
    <motion.div
      className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-gray-700 transition-all duration-300 hover:border-primary-500 hover:shadow-lg"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:space-x-4">
        <div className="bg-primary-500/10 p-2 sm:p-3 rounded-full flex-shrink-0 mb-4 sm:mb-0">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-base sm:text-lg font-semibold text-white">{title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary-400 hover:text-primary-300 transition-colors text-sm group"
          >
            {linkLabel}
            <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </motion.div>
  )
}

export const ContactContent = () => {
  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
      <motion.header
        className="text-center mb-8 sm:mb-12 lg:mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary-500/20 border border-primary-500/30 mb-4 sm:mb-6"
          whileHover={{ scale: 1.05 }}
        >
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary-400" />
          <span className="text-xs sm:text-sm text-primary-400 font-medium">Kontakt</span>
        </motion.div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 tracking-tight">
          Stupite u kontakt s nama
        </h1>
        <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Ako imate pitanja, trebate dodatne informacije ili želite surađivati, slobodno nam se javite. Tu smo da vam
          pomognemo!
        </p>
      </motion.header>

      <motion.div
        className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <ContactMethod
          icon={Mail}
          title="Pošaljite nam email"
          description="Slobodno nam se javite putem emaila za bilo kakva pitanja, prijedloge ili informacije. Odgovorit ćemo vam u najkraćem mogućem roku."
          href="mailto:dragojevicdobren@gmail.com"
          linkLabel="dragojevicdobren@gmail.com"
        />
        <ContactMethod
          icon={MessageCircle}
          title="Pridružite se WhatsApp grupi"
          description="Budite dio naše zajednice na WhatsAppu. Primajte najnovije informacije, sudjelujte u diskusijama i povežite se s drugim korisnicima."
          href="https://chat.whatsapp.com/H9Gqn0TWWlt0zWMbA1mSfV"
          linkLabel="Pridružite se grupi"
        />
      </motion.div>
    </div>
  )
}

