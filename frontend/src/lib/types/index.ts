export type SkillLevel = 'beginner' | 'intermediate' | 'competent' | 'advanced';

export interface Profile {
  id: string;
  full_name: string | null;
  skill_level: SkillLevel | null;
  instruments: string[];
  goals: string[];
  profile_md: string | null;
}
