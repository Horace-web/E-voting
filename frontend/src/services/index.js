/**
 * Point d'entrée centralisé pour tous les services API
 *
 * Usage:
 * import { authService, electionService, voteService } from './services';
 *
 * ou
 *
 * import services from './services';
 * services.auth.login(...)
 * services.elections.getAll(...)
 */

import authService from "./auth.service";
import electionService from "./election.service";
import candidateService from "./candidate.service";
import userService from "./user.service";
import voteService from "./vote.service";
import resultService from "./result.service";
import auditService from "./audit.service";

// Export individuel
export {
  authService,
  electionService,
  candidateService,
  userService,
  voteService,
  resultService,
  auditService,
};

// Export groupé
const services = {
  auth: authService,
  elections: electionService,
  candidates: candidateService,
  users: userService,
  votes: voteService,
  results: resultService,
  audit: auditService,
};

export default services;
