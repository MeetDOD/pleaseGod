import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Gavel, UserX, MailWarning, Banknote, SmilePlus, EyeOff, AlarmClock } from "lucide-react";

const scenarios = [
  {
    id: 1,
    title: "Tenant Rights Violation",
    shortDesc: "Landlord refuses to return the security deposit.",
    fullDesc: `Landlords must return the security deposit to tenants upon proper vacating of property, barring valid deductions. If the landlord unreasonably withholds the deposit, it may amount to a violation of tenant rights. Tenants may send legal notices or approach the Rent Control Tribunal. In some states, interest on the withheld deposit can also be claimed.`,
    icon: ShieldAlert
  },
  {
    id: 2,
    title: "Cyberbullying on Social Media",
    shortDesc: "User experiences repeated harassment online.",
    fullDesc: `Cyberbullying involves abusive messages, impersonation, doxing, and repeated online threats. Under IPC Sections 507, 509, and the IT Act, victims can file an FIR or report through cybercrime.gov.in. Courts may order platforms to remove content. Victims can also seek civil damages for harassment.`,
    icon: MailWarning
  },
  {
    id: 3,
    title: "Workplace Sexual Harassment",
    shortDesc: "Female employee harassed by superior at work.",
    fullDesc: `Under the POSH Act, 2013, workplaces must constitute an Internal Complaints Committee (ICC). Women can submit a written complaint within 3 months. ICCs are obligated to conduct hearings, take statements, and recommend actions. Remedies may include termination, transfer, or monetary compensation.`,
    icon: UserX
  },
  {
    id: 4,
    title: "Consumer Product Malfunction",
    shortDesc: "Purchased product exploded and caused injury.",
    fullDesc: `Under the Consumer Protection Act, 2019, defective goods that cause injury or loss entitle the consumer to compensation. Courts assess negligence, quality of materials, and documentation such as invoices. Manufacturers, retailers, and service centers may be jointly liable.`,
    icon: Gavel
  },
  {
    id: 5,
    title: "Illegal Termination from Job",
    shortDesc: "Employee fired without valid reason or notice.",
    fullDesc: `Employees unlawfully terminated without notice or cause can seek redress in labor courts. Termination must follow proper procedures outlined in the Industrial Disputes Act. Reinstatement, back wages, or settlements may be awarded depending on evidence and employment terms.`,
    icon: Banknote
  },
  {
    id: 6,
    title: "Dowry Harassment",
    shortDesc: "Woman harassed for dowry after marriage.",
    fullDesc: `Dowry-related harassment or cruelty is criminalized under IPC 498A. The woman or her relatives can lodge an FIR and seek immediate police protection. Arrests may be made without warrant. Courts may grant maintenance and issue restraining orders.`,
    icon: SmilePlus
  },
  {
    id: 7,
    title: "Online Banking Fraud",
    shortDesc: "User loses money in phishing scam.",
    fullDesc: `Phishing and banking fraud fall under the IT Act and IPC. Victims should report to the bank within 24 hours and file a cybercrime complaint. RBI guidelines may allow banks to reimburse losses under defined conditions. Swift action helps trace fraudulent transfers.`,
    icon: EyeOff
  },
  {
    id: 8,
    title: "Child Custody Dispute",
    shortDesc: "Divorced couple fights over child custody.",
    fullDesc: `Family courts prioritize the child's welfare while deciding custody. Courts consider financial stability, caregiving capacity, and moral environment. Guardianship may be joint, sole, or with visitation rights. The Guardian and Wards Act, along with personal laws, guide decisions.`,
    icon: AlarmClock
  },
  {
    id: 9,
    title: "Fake Property Document",
    shortDesc: "Bought land with forged property papers.",
    fullDesc: `Forged land documents violate IPC Section 420. Victims can file criminal and civil cases to cancel deeds. Evidence such as original records, registry logs, and witness testimony are needed. Legal notices should be served before approaching the court.`,
    icon: Gavel
  }
];

const LegalScenarios = () => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="p-6 min-h-screen bg-transparent-100">
      <h1 className="text-4xl md:text-4xl font-bold mb-3 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Legal Scenarios
      </h1>
      <h2 className="text-lg text-gray-500 md:text-xl font-medium mb-20 text-center">
        Explore common legal situations and understand your rights.
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {scenarios.map(({ id, title, shortDesc, icon: Icon }) => (
          <motion.div
            key={id}
            onClick={() => setSelected(scenarios.find((s) => s.id === id))}
            className="rounded-2xl p-5 shadow-md hover:shadow-xl cursor-pointer transition-all h-60"
            whileHover={{ scale: 1.03 }}
          >
            <div className="flex flex-col items-center mb-4">
              <Icon className="w-12 h-12 text-primary mb-2" />
              <h3 className="text-lg font-semibold text-center">
                {title}
              </h3>
            </div>

            <p className="text-sm text-gray-500 ">
              {shortDesc}
            </p>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="rounded-xl shadow-2xl max-w-xl w-full p-10 relative border"
              style={{ backgroundColor: `var(--background-color)`, borderColor: `var(--borderColor)` }}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-4 text-2xl text-gray-500 dark:text-gray-200"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-4 opacity-90">
                {selected.title}
              </h2>
              <p className="whitespace-pre-wrap text-justify">
                {selected.fullDesc}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LegalScenarios;
