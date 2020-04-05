import React, { ReactEventHandler } from 'react'
import classnames from 'classnames'
import { StreamWithURL } from '../reducers/streams'
import { NicknameMessage } from '../actions/PeerActions'
import { Nickname } from './Nickname'
import { Dropdown } from './Dropdown'

export interface VideoProps {
  // videos: Record<string, unknown>
  onClick: (userId: string) => void
  onChangeNickname: (message: NicknameMessage) => void
  nickname: string
  active: boolean
  stream?: StreamWithURL
  userId: string
  muted: boolean
  mirrored: boolean
  play: () => void
  localUser?: boolean
}

export default class Video extends React.PureComponent<VideoProps> {
  videoRef = React.createRef<HTMLVideoElement>()

  static defaultProps = {
    muted: false,
    mirrored: false,
  }
  handleClick: ReactEventHandler<HTMLVideoElement> = e => {
    this.props.play()
  }
  componentDidMount () {
    this.componentDidUpdate()
  }
  componentDidUpdate () {
    const { stream } = this.props
    const video = this.videoRef.current!
    const mediaStream = stream && stream.stream || null
    const url = stream && stream.url
    if ('srcObject' in video as unknown) {
      if (video.srcObject !== mediaStream) {
        video.srcObject = mediaStream
      }
    } else if (video.src !== url) {
      video.src = url || ''
    }
  }
  handleMaximize = () => {
    this.props.onClick(this.props.userId)
  }
  handleToggleCover = () => {
    const v = this.videoRef.current
    if (v) {
      v.style.objectFit = v.style.objectFit ? '' : 'cover'
    }
  }
  render () {
    const { active, mirrored, muted, userId } = this.props
    const className = classnames('video-container', { active, mirrored })

    return (
      <div className={className}>
        <div className='video-buttons'>
          <Dropdown label={'☰'}>
            <li onClick={this.handleMaximize}>Maximize</li>
            <li onClick={this.handleToggleCover}>Fit to screen</li>
          </Dropdown>
        </div>
        <video
          id={`video-${userId}`}
          autoPlay
          onClick={this.handleClick}
          onLoadedMetadata={() => this.props.play()}
          playsInline
          ref={this.videoRef}
          muted={muted}
        />
        <Nickname
          value={this.props.nickname}
          onChange={this.props.onChangeNickname}
          localUser={this.props.localUser}
        />
      </div>
    )
  }
}
