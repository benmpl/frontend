import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Loader, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import Rating from 'shared_components/Rating';
import Button from 'shared_components/Button';

import AnonymousAvatar from 'assets/no-avatar.png';

const Wrapper = styled.div`
  max-width: 600px;
  margin-bottom: 25px;
`;

const Review = styled.div`
  margin-bottom: 15px;
  border: 1px solid #e5e5e5;
  padding: 10px;
  border-radius: 5px;
`;

const ButtonWrapper = styled.div`
  text-align: center;
`;

const Body = styled.div`
  font-size: 14px;
`;

const UserAndReview = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  margin-top: 5px;
  a {
    color: #4fb798;
    &:hover {
      color: #38d39f;
    }
  }
`;

const RatingWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  > span {
    margin-right: 4px;
  }
`;

const User = styled.div`
  justify-self: flex-end;
  align-items: center;
  display: flex;
  img {
    width: 25px;
    height: 25px;
  }
`;

const Username = styled.div`
  margin-right: 10px;
`;

const Empty = styled.div`
  font-size: 18px;
  text-align: center;
`;

class ServiceReviews extends React.Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    reviews: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        body: PropTypes.string.isRequired,
        rating: PropTypes.number.isRequired,
        user: PropTypes.shape({
          name: PropTypes.string.isRequired,
          type: PropTypes.string,
        }).isRequired,
      }),
    ).isRequired,
    fetchMore: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };

  fetchMore = () => {
    return this.props.fetchMore();
  };

  renderUser(review) {
    const user = (
      <User>
        <Username>{review.user.name}</Username>
        <Image src={review.user.image || AnonymousAvatar} circular />
      </User>
    );

    return review.user.type === 'internal' ? (
      <Link to={`/users/${review.user.name}`}>{user}</Link>
    ) : (
      user
    );
  }

  renderFooter = () => {
    if (this.props.isLoading) {
      return <Loader active inline="centered" />;
    }

    if (this.props.reviews.length < this.props.totalCount) {
      return (
        <ButtonWrapper>
          <Button onClick={this.fetchMore}>View more</Button>
        </ButtonWrapper>
      );
    }

    return null;
  };

  render() {
    if (this.props.isLoading && this.props.reviews.length === 0) {
      return <Loader active inline="centered" />;
    }

    if (!this.props.isLoading && this.props.totalCount === 0) {
      return <Empty>This service does not have any review yet.</Empty>;
    }
    return (
      <>
        {this.props.reviews.map(review => (
          <Review key={review._id}>
            <Body>{review.body}</Body>
            <UserAndReview>
              <RatingWrapper>
                <span>Rating:</span>
                <Rating rating={review.rating} marginBottom="2px" />
              </RatingWrapper>
              {this.renderUser(review)}
            </UserAndReview>
          </Review>
        ))}
        {this.renderFooter()}
      </>
    );
  }
}

export default props => (
  <Wrapper>
    <ServiceReviews {...props} />
  </Wrapper>
);
