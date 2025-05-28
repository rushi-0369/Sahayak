-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title text NOT NULL,
  category text NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  description text,
  energy_level text NOT NULL,
  focus_level text NOT NULL,
  duration_minutes integer NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  
  -- Add constraints
  CONSTRAINT valid_category CHECK (
    category IN ('work', 'meeting', 'email', 'learning', 'break', 'social', 'personal')
  ),
  CONSTRAINT valid_energy_level CHECK (
    energy_level IN ('low', 'medium', 'high')
  ),
  CONSTRAINT valid_focus_level CHECK (
    focus_level IN ('low', 'medium', 'high')
  ),
  CONSTRAINT valid_duration CHECK (
    duration_minutes > 0
  ),
  CONSTRAINT valid_time_range CHECK (
    end_time > start_time
  )
);

-- Enable RLS
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own activities"
  ON activities
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own activities"
  ON activities
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own activities"
  ON activities
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own activities"
  ON activities
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER activities_updated_at
  BEFORE UPDATE ON activities
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create indexes
CREATE INDEX activities_user_id_idx ON activities(user_id);
CREATE INDEX activities_start_time_idx ON activities(start_time);
CREATE INDEX activities_category_idx ON activities(category);