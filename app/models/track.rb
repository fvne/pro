# == Schema Information
#
# Table name: tracks
#
#  id         :integer          not null, primary key
#  title      :string           not null
#  audio_url  :string           not null
#  image_url  :string
#  user_id    :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Track < ActiveRecord::Base
  belongs_to :user
  has_many :track_likes
  has_many :likers, through: :track_likes, source: :user

  validates(
    :title,
    :audio_url,
    :user_id,
    presence: true
  )
end