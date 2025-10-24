/**
 * Type definitions for BOLT UBC website data structures
 */

/**
 * Represents a team member/executive
 */
export interface Member {
  /** Full name of the team member */
  name: string;
  /** Position/role title */
  title: string;
  /** Filename of the profile picture (stored in /public/profiles/) - optional for past executives */
  profilepic?: string;
  /** LinkedIn profile URL (optional) */
  linkedin?: string;
  /** Personal email for leadership (optional) */
  personalEmail?: string;
  /** Club role email for leadership (optional) */
  clubEmail?: string;
}

/**
 * Represents a team within the organization
 */
export interface Team {
  /** Name of the team (e.g., "Marketing", "Development") */
  team_name: string;
  /** Array of executives in this team */
  executives: Member[];
}

/**
 * Root structure for team data (team.json)
 */
export interface TeamData {
  /** Array of all teams in the organization */
  teams: Team[];
  /** Past executives organized by year */
  pastExecutives: {
    [year: string]: Member[];
  };
}

/**
 * Represents an event hosted by BOLT
 */
export interface Event {
  /** Event name */
  name: string;
  /** Filename of the event image (stored in /public/events/) */
  image: string;
}

/**
 * Root structure for events data (events.json)
 */
export interface EventsData {
  /** Array of all events */
  events: Event[];
}

/**
 * Common component props
 */

/**
 * Props for button components
 */
export interface ButtonProps {
  /** Button text content */
  text: string;
  /** Click handler function */
  onClick: () => void;
  /** Use outline variant style */
  outline?: boolean;
  /** Button type attribute */
  type?: 'button' | 'submit' | 'reset';
}

