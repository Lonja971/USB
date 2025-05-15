import { AnimatePresence, motion } from "framer-motion";
import { MainLoadingScreen } from "../MainLoadingScreen";

/**
 * @param {{ isVisible: boolean }} props
 */
export const LoadingOverlay = ({ isVisible }) => (
   <AnimatePresence>
      {isVisible && (
         <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, pointerEvents: "none" }}
            transition={{ duration: 0.5 }}
         >
            <MainLoadingScreen />
         </motion.div>
      )}
   </AnimatePresence>
);
